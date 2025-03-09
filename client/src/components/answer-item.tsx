import type React from "react"
import { MessageSquare, Share2, Check } from 'lucide-react'
import UserCard from "./user-card"
import VoteControls from "./vote-controls"
import EnhancedContent from "@/components/EnhancedContent"
import { VoteResponseDTO } from "@/types/questionTypes"

interface User {
    id: number
    fullName: string
    avatarUrl?: string
    reputation?: number
}

interface Vote {
    userId: number
    value: number
}

interface Answer {
    id: number
    content: string
    valid: boolean
    votes: VoteResponseDTO[]
}

interface AnswerItemProps {
    answer: Answer
    user: User | undefined
    currentUserId?: number
    isQuestionAuthor: boolean
    onAccept: (answerId: number) => void
    onVote: (answerId: number, voteType: "up" | "down" | "none") => void
    createdAt: string
}

const AnswerItem: React.FC<AnswerItemProps> = ({
                                                   answer,
                                                   user,
                                                   currentUserId,
                                                   isQuestionAuthor,
                                                   onAccept,
                                                   onVote,
                                                   createdAt,
                                               }) => {
    return (
        <div
            className={`border rounded-xl shadow-sm mb-6 overflow-hidden transition-all duration-200 hover:shadow-md
                ${answer.valid
                ? "bg-gradient-to-r from-green-50 to-green-50/30 border-green-200"
                : "bg-white border-gray-200"}`}
        >
            {answer.valid && (
                <div className="bg-green-500/10 border-b border-green-200 py-2 px-4 flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">Accepted Answer</span>
                </div>
            )}

            <div className="p-6">
                <div className="flex gap-6">
                    {/* Vote controls */}
                    <div className="shrink-0">
                        <VoteControls
                            itemId={answer.id}
                            votes={answer.votes}
                            currentUserId={currentUserId}
                            type="answer"
                            isValid={answer.valid}
                            canAccept={isQuestionAuthor}
                            onAccept={() => onAccept(answer.id)}
                            onVote={(voteType) => onVote(answer.id, voteType)}
                        />
                    </div>

                    {/* Answer content */}
                    <div className="flex-1 min-w-0">
                        <div className="prose max-w-none mb-4">
                            <EnhancedContent htmlContent={answer.content} />
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
                            <button className="text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-1.5">
                                <MessageSquare size={16} />
                                <span>Add comment</span>
                            </button>

                            <button className="text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-1.5">
                                <Share2 size={16} />
                                <span>Share</span>
                            </button>

                            {isQuestionAuthor && !answer.valid && (
                                <button
                                    onClick={() => onAccept(answer.id)}
                                    className="ml-auto text-green-600 hover:text-green-700 transition-colors flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg"
                                >
                                    <Check size={16} />
                                    <span>Accept answer</span>
                                </button>
                            )}
                        </div>

                        {/* User card */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                            {user && (
                                <UserCard
                                    userId={user.id}
                                    fullName={user.fullName}
                                    avatarUrl={user.avatarUrl}
                                    reputation={user.reputation}
                                    date={createdAt}
                                    action="answered"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnswerItem
