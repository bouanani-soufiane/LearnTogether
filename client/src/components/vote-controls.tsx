"use client"

import React, {useEffect} from "react"
import { useState } from "react"
import { FaArrowDown, FaArrowUp, FaCheck } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import {useAuthStore} from "@/store/authStore";
import {calculateVoteTotal, VoteResponseDTO} from "@/types/questionTypes";


interface VoteControlsProps {
    itemId: number
    votes: VoteResponseDTO[]
    currentUserId?: number
    type: "question" | "answer"
    isValid?: boolean
    canAccept?: boolean
    onAccept?: () => void
    onVote: (type: "up" | "down" | "none") => void
}

const VoteControls: React.FC<VoteControlsProps> = ({
                                                       itemId,
                                                       votes,
                                                       currentUserId,
                                                       type,
                                                       isValid,
                                                       canAccept,
                                                       onAccept,
                                                       onVote,
                                                   }) => {

    useEffect(() => {
        if (type === "answer") {
            console.log("Vote Controls Props:", {
                itemId,
                type,
                isValid,
                canAccept,
                hasOnAccept: !!onAccept,
                buttonDisabled: !canAccept || !onAccept
            });
        }
    }, [itemId, type, isValid, canAccept, onAccept]);

    const { isAuthenticated } = useAuthStore()
    const navigate = useNavigate()
    const totalVotes = calculateVoteTotal(votes)

    const userVote = currentUserId ? votes.find((vote) => vote.userId === currentUserId) : undefined

    const [isVoting, setIsVoting] = useState(false)

    const handleVote = async (voteType: "up" | "down") => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }

        if (isVoting) return

        try {
            setIsVoting(true)

            let actualVoteType: "up" | "down" | "none" = voteType

            if (userVote) {
                if ((voteType === "up" && userVote.value > 0) || (voteType === "down" && userVote.value < 0)) {
                    actualVoteType = "none"
                }
            }
            onVote(actualVoteType)
        } catch (error) {
            console.error(`Error voting on ${type}:`, error)
        } finally {
            setIsVoting(false)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <button
                className={`p-2 rounded-full ${userVote && userVote.value > 0 ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleVote("up")}
                disabled={isVoting}
                aria-label="Upvote"
            >
                <FaArrowUp />
            </button>

            <span
                className={`text-lg font-medium my-2 ${totalVotes > 0 ? "text-gray-800" : totalVotes < 0 ? "text-red-600" : "text-gray-500"}`}
            >
        {totalVotes}
      </span>

            <button
                className={`p-2 rounded-full ${userVote && userVote.value < 0 ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleVote("down")}
                disabled={isVoting}
                aria-label="Downvote"
            >
                <FaArrowDown />
            </button>

            {type === "answer" && (
                <button
                    className={`mt-4 p-2 rounded-full ${
                        isValid
                            ? "bg-green-100 text-green-600"
                            : canAccept
                                ? "text-gray-400 hover:bg-gray-100 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed"
                    }`}
                    onClick={() => {
                        console.log("Accept button clicked", { canAccept, hasOnAccept: !!onAccept });
                        if (canAccept && onAccept) onAccept();
                    }}
                    disabled={!canAccept || !onAccept}
                    title={isValid ? "Accepted answer" : canAccept ? "Mark as accepted answer" : "Only question author can accept answers"}
                    aria-label={isValid ? "Accepted answer" : "Accept answer"}
                >
                    <FaCheck />
                </button>
            )}
        </div>
    )
}

export default VoteControls

