import type React from "react"
import { FaCheck, FaRegCommentAlt, FaShare } from "react-icons/fa"
import UserCard from "./user-card"
import VoteControls from "./vote-controls"
import EnhancedContent from "@/components/EnhancedContent";
import {VoteResponseDTO} from "@/types/questionTypes";

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
        <div className={`border-b border-gray-200 py-6 ${answer.valid ? "bg-green-50 border-l-4 border-l-green-500" : ""}`}>
            <div className="flex">
                <div className="mr-6">
                    <VoteControls
                        itemId={answer.id}
                        votes={answer.votes}
                        currentUserId={currentUserId}
                        type="answer"
                        isValid={answer.valid}
                        canAccept={isQuestionAuthor && !answer.valid}
                        onAccept={() => onAccept(answer.id)}
                        onVote={(voteType) => onVote(answer.id, voteType)}
                    />
                </div>

                <div className="flex-1">
                    {/* Use EnhancedContent to display the answer */}
                    <div className="prose max-w-none">
                        <EnhancedContent htmlContent={answer.content} />
                    </div>

                    {answer.valid && (
                        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md inline-flex items-center">
                            <FaCheck className="mr-2" />
                            <span>This answer has been accepted</span>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
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

                    <div className="mt-4 flex text-sm">
                        <button className="text-gray-500 hover:text-blue-600 mr-4 flex items-center">
                            <FaRegCommentAlt className="mr-1" /> Add comment
                        </button>
                        <button className="text-gray-500 hover:text-blue-600 flex items-center">
                            <FaShare className="mr-1" /> Share
                        </button>

                        {isQuestionAuthor && !answer.valid && (
                            <button
                                onClick={() => onAccept(answer.id)}
                                className="ml-4 text-green-600 hover:text-green-800 flex items-center"
                            >
                                <FaCheck className="mr-1" /> Accept answer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnswerItem;

