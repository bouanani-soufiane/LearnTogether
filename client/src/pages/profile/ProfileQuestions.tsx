import React from "react"
import { Link } from "react-router-dom"
import { ArrowUp, MessageSquare, Eye } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for questions
const questions = [
    {
        id: "1",
        title: "How to implement authentication with Next.js and NextAuth.js?",
        body: "I'm trying to implement authentication in my Next.js application using NextAuth.js but I'm running into issues with the session management...",
        votes: 24,
        answers: 3,
        views: 1243,
        tags: ["next.js", "authentication", "react"],
        createdAt: "2023-11-15T14:23:00Z"
    },
    {
        id: "2",
        title: "Best practices for state management in large React applications",
        body: "I'm working on a large-scale React application and I'm wondering what are the current best practices for state management...",
        votes: 42,
        answers: 7,
        views: 3521,
        tags: ["react", "redux", "state-management"],
        createdAt: "2023-10-22T09:15:00Z"
    },
    {
        id: "3",
        title: "How to optimize performance in React with useMemo and useCallback",
        body: "I'm trying to understand when I should use useMemo and useCallback hooks to optimize my React components...",
        votes: 18,
        answers: 5,
        views: 982,
        tags: ["react", "performance", "hooks"],
        createdAt: "2023-09-05T16:45:00Z"
    }
]

export function ProfileQuestions() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Questions</h2>
                <Link
                    to="/questions/ask"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    Ask Question
                </Link>
            </div>

            {questions.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">You haven't asked any questions yet.</p>
                    </CardContent>
                </Card>
            ) : (
                questions.map((question) => (
                    <Card key={question.id} className="hover:border-blue-200 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 md:w-24">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <ArrowUp className="h-4 w-4" />
                                        <span>{question.votes}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>{question.answers}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                        <span>{question.views}</span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <Link to={`/questions/${question.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                                        {question.title}
                                    </Link>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{question.body}</p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {question.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="mt-4 text-xs text-muted-foreground">
                                        Asked on {new Date(question.createdAt).toLocaleDateString('en-US', {
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
