// src/pages/profile/ProfileAnswers.tsx
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUp, Check, Loader2 } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiInstance } from "@/api"
import { calculateVoteTotal } from "@/types/questionTypes"

interface UserAnswer {
    id: number;
    questionId: number;
    questionTitle: string;
    content: string;
    votes: number;
    isAccepted: boolean;
    createdAt: string;
    tags: string[];
}

interface ProfileAnswersProps {
    userId: number;
}

export function ProfileAnswers({ userId }: ProfileAnswersProps) {
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserAnswers = async () => {
            if (!userId) return;

            setIsLoading(true);
            setError(null);

            try {
                // Fetch user's answers
                const answersResponse = await apiInstance.get(`/api/v1/users/${userId}/answers`);
                const rawAnswers = answersResponse.data;

                // Process each answer to get question details and transform data
                const processedAnswers = await Promise.all(
                    rawAnswers.map(async (answer: any) => {
                        try {
                            // Get question details for the answer
                            const questionResponse = await apiInstance.get(`/api/v1/questions/${answer.questionId}`);
                            const question = questionResponse.data;

                            return {
                                id: answer.id,
                                questionId: answer.questionId,
                                questionTitle: question.title,
                                content: answer.content,
                                votes: calculateVoteTotal(answer.votes),
                                isAccepted: answer.valid,
                                createdAt: answer.createdAt || new Date().toISOString(),
                                tags: question.tags ? question.tags.map((tag: any) => tag.name) : []
                            };
                        } catch (err) {
                            // If question fetch fails, return with partial data
                            return {
                                id: answer.id,
                                questionId: answer.questionId,
                                questionTitle: "Question unavailable",
                                content: answer.content,
                                votes: calculateVoteTotal(answer.votes),
                                isAccepted: answer.valid,
                                createdAt: answer.createdAt || new Date().toISOString(),
                                tags: []
                            };
                        }
                    })
                );

                setAnswers(processedAnswers);
            } catch (err: any) {
                console.error("Error fetching user answers:", err);
                setError(err.message || "Failed to load answers");

                // For development, use mock data when API fails
                if (process.env.NODE_ENV !== 'production') {
                    setAnswers([
                        {
                            id: 1,
                            questionId: 101,
                            questionTitle: "How to implement server-side rendering with React?",
                            content: "Server-side rendering (SSR) can be implemented in React using frameworks like Next.js...",
                            votes: 32,
                            isAccepted: true,
                            createdAt: new Date().toISOString(),
                            tags: ["react", "ssr", "next.js"]
                        }
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserAnswers();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2">Loading answers...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-red-500 mb-2">Error loading answers</p>
                    <p className="text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Your Answers</h2>

            {(!answers || answers.length === 0) ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">You haven't answered any questions yet.</p>
                    </CardContent>
                </Card>
            ) : (
                answers.map((answer) => (
                    <Card key={answer.id} className="hover:border-blue-200 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 md:w-24">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <ArrowUp className="h-4 w-4" />
                                        <span>{answer.votes}</span>
                                    </div>
                                    {answer.isAccepted && (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <Check className="h-4 w-4" />
                                            <span className="text-xs">Accepted</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <Link to={`/questions/${answer.questionId}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                                        {answer.questionTitle}
                                    </Link>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{answer.content}</p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {answer.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="mt-4 text-xs text-muted-foreground">
                                        Answered on {new Date(answer.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}