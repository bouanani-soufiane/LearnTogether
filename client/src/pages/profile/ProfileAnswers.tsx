import React from "react"
import { Link } from "react-router-dom"
import { ArrowUp, Check } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for answers
const answers = [
    {
        id: "1",
        questionId: "101",
        questionTitle: "How to implement server-side rendering with React?",
        body: "Server-side rendering (SSR) can be implemented in React using frameworks like Next.js. Next.js provides built-in SSR capabilities that make it easy to render React components on the server...",
        votes: 32,
        isAccepted: true,
        createdAt: "2023-12-10T11:23:00Z",
        tags: ["react", "ssr", "next.js"]
    },
    {
        id: "2",
        questionId: "102",
        questionTitle: "What's the difference between useMemo and useCallback in React?",
        body: "The main difference between useMemo and useCallback is that useMemo returns a memoized value, while useCallback returns a memoized function. Use useMemo when you want to avoid expensive calculations on every render...",
        votes: 27,
        isAccepted: false,
        createdAt: "2023-11-05T09:45:00Z",
        tags: ["react", "hooks", "performance"]
    },
    {
        id: "3",
        questionId: "103",
        questionTitle: "How to handle form validation in React?",
        body: "For form validation in React, you can use libraries like Formik or React Hook Form. These libraries provide a way to manage form state, handle validation, and deal with form submission...",
        votes: 19,
        isAccepted: true,
        createdAt: "2023-10-22T14:30:00Z",
        tags: ["react", "forms", "validation"]
    }
]

export function ProfileAnswers() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Your Answers</h2>

            {answers.length === 0 ? (
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
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{answer.body}</p>

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
