"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useAuthStore } from "../../store/authStore";
import { useQuestionStore } from "../../store/questionStore";
import {
    FaExclamationTriangle,
    FaPen,
    FaRegBookmark,
    FaRegClock,
    FaRegCommentAlt,
    FaRegEye,
    FaShare,
} from "react-icons/fa";
import EnhancedContent from "@/components/EnhancedContent";
import AddAnswerForm from "@/components/add-answer-form";
import UserCard from "@/components/user-card";
import VoteControls from "@/components/vote-controls";
import AnswerItem from "@/components/answer-item";

interface User {
    id: number;
    fullName: string;
    avatarUrl?: string;
    reputation?: number;
}

const fetchUserById = async (userId: number): Promise<User> => {
    return {
        id: userId,
        fullName: `User ${userId}`,
        avatarUrl: undefined,
        reputation: Math.floor(Math.random() * 1000) + 100,
    };
};

const QuestionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const questionId = Number.parseInt(id || "0");
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        currentQuestion,
        isQuestionLoading,
        questionError,
        fetchQuestionById,
        voteOnQuestion,
        voteOnAnswer,
        acceptAnswer,
    } = useQuestionStore();

    const [questionUser, setQuestionUser] = useState<User | null>(null);
    const [answerUsers, setAnswerUsers] = useState<Map<number, User>>(new Map());
// Convert both to strings for reliable comparison
    const isQuestionAuthor = Boolean(
        user &&
        currentQuestion &&
        String(user.id) === String(currentQuestion.userId)
    );
    useEffect(() => {
        if (questionId > 0) {
            fetchQuestionById(questionId);
        }
    }, [questionId, fetchQuestionById]);

    useEffect(() => {
        if (currentQuestion && user) {
            console.log("User vs Question Author DEBUG:", {
                user: {
                    id: user.id,
                    type: typeof user.id
                },
                question: {
                    userId: currentQuestion.userId,
                    type: typeof currentQuestion.userId
                },
                stringEquality: String(user.id) === String(currentQuestion.userId),
                numberEquality: Number(user.id) === Number(currentQuestion.userId)
            });
        }
    }, [currentQuestion, user]);

    const handleQuestionVote = (voteType: "up" | "down" | "none") => {
        voteOnQuestion(questionId, voteType);
    };

    const handleAnswerVote = (answerId: number, voteType: "up" | "down" | "none") => {
        voteOnAnswer(answerId, voteType);
    };

    const handleAcceptAnswer = (answerId: number) => {
        acceptAnswer(answerId);
    };

    const refreshQuestion = () => {
        fetchQuestionById(questionId);
    };

    if (isQuestionLoading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-0 md:ml-[200px]">
                    <div className="max-w-5xl mx-auto px-4 py-10">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (questionError || !currentQuestion) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-0 md:ml-[200px]">
                    <div className="max-w-5xl mx-auto px-4 py-10">
                        <div className="bg-red-50 p-6 rounded-lg text-center">
                            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Question</h2>
                            <p className="text-red-600 mb-4">{questionError || "Question not found"}</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={() => fetchQuestionById(questionId)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    const answerCount = currentQuestion.answers ? currentQuestion.answers.length : 0;
    const createdAt = currentQuestion.createdAt || new Date().toISOString();
    const viewCount = currentQuestion.viewCount || Math.floor(Math.random() * 100) + 10;


    const contentString =
        typeof currentQuestion.content === "object" && currentQuestion.content
            ? currentQuestion.content
            : currentQuestion.content;

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 ml-0 md:ml-[200px]">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    {/* Question header */}
                    <div className="border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h1>

                        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                            <div className="flex items-center">
                                <FaRegClock className="mr-1" />
                                <span>Asked {new Date(createdAt).toLocaleString()}</span>
                            </div>

                            <div className="flex items-center">
                                <FaRegEye className="mr-1" />
                                <span>Viewed {viewCount} times</span>
                            </div>
                        </div>
                    </div>

                    <div className="py-6">
                        <div className="flex">
                            <div className="mr-6">
                                <VoteControls
                                    itemId={currentQuestion.id}
                                    votes={currentQuestion.votes}
                                    currentUserId={user?.id}
                                    type="question"
                                    onVote={handleQuestionVote}
                                />

                                <div className="mt-4 flex flex-col items-center text-sm">
                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                        <FaRegBookmark size={16} />
                                    </button>
                                    <button className="p-2 mt-2 text-gray-400 hover:text-gray-600">
                                        <FaShare size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <EnhancedContent
                                    htmlContent={contentString}
                                    contentType="code"
                                    language="java"
                                />

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {currentQuestion.tags &&
                                        currentQuestion.tags.map((tag: any) => (
                                            <Link
                                                key={tag.id}
                                                to={`/tags/${tag.name}`}
                                                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-xs"
                                            >
                                                {tag.name}
                                            </Link>
                                        ))}
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex text-sm">
                                        <button className="text-gray-500 hover:text-blue-600 mr-4 flex items-center">
                                            <FaRegCommentAlt className="mr-1" /> Add comment
                                        </button>

                                        {isQuestionAuthor && (
                                            <Link
                                                to={`/questions/${currentQuestion.id}/edit`}
                                                className="text-gray-500 hover:text-blue-600 flex items-center"
                                            >
                                                <FaPen className="mr-1" /> Edit
                                            </Link>
                                        )}
                                    </div>

                                    {questionUser && (
                                        <UserCard
                                            userId={questionUser.id}
                                            fullName={questionUser.fullName}
                                            avatarUrl={questionUser.avatarUrl}
                                            reputation={questionUser.reputation}
                                            date={createdAt}
                                            action="asked"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-bold border-b border-gray-200 pb-2 mb-4">
                                {answerCount} {answerCount === 1 ? "Answer" : "Answers"}
                            </h2>

                            {currentQuestion.answers && currentQuestion.answers.length > 0 ? (
                                <div>

                                    {currentQuestion.answers.map((answer: any) => {
                                        const answerUser = answerUsers.get(answer.id);
                                        return (
                                            <AnswerItem
                                                key={answer.id}
                                                answer={answer}
                                                user={answerUser}
                                                currentUserId={user?.id}
                                                isQuestionAuthor={isQuestionAuthor}
                                                onAccept={handleAcceptAnswer}
                                                onVote={handleAnswerVote}
                                                createdAt={answer.createdAt || createdAt}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No answers yet. Be the first to answer this question!</p>
                                </div>
                            )}
                        </div>

                        <AddAnswerForm questionId={currentQuestion.id} onAnswerAdded={refreshQuestion} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetailPage;
