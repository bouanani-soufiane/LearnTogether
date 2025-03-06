"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import LexicalEditor from "@/components/LexicalEditor";
import {useQuestionStore} from "@/store/questionStore";
import {useAuthStore} from "@/store/authStore";

interface AddAnswerFormProps {
    questionId: number
    onAnswerAdded: () => void
}

const AddAnswerForm: React.FC<AddAnswerFormProps> = ({ questionId, onAnswerAdded }) => {
    const [content, setContent] = useState("")
    const { isSubmittingAnswer, submitAnswerError, submitAnswer } = useQuestionStore()
    const { isAuthenticated } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/questions/${questionId}` } })
            return
        }

        if (content.trim().length < 10) {
            // Handle validation locally without setting in the store
            return
        }

        await submitAnswer(questionId, content)
        setContent("")
        onAnswerAdded()
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-blue-50 p-4 rounded-md text-center">
                <p className="text-blue-800 mb-2">You need to be logged in to answer this question.</p>
                <Link
                    to="/login"
                    state={{ from: `/questions/${questionId}` }}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Log in to answer
                </Link>
            </div>
        )
    }

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Your Answer</h2>

            {submitAnswerError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">{submitAnswerError}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <LexicalEditor onChange={setContent} placeholder="Write your answer here..." minHeight="200px" />
                </div>

                <button
                    type="submit"
                    disabled={isSubmittingAnswer}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                >
                    {isSubmittingAnswer ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Posting...
                        </>
                    ) : (
                        "Post Your Answer"
                    )}
                </button>
            </form>
        </div>
    )
}

export default AddAnswerForm

