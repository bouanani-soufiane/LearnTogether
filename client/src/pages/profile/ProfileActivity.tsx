import React from "react"
import { Link } from "react-router-dom"
import { MessageSquare, ArrowUp, Award, Edit, Check, ThumbsUp, Tag } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for activity
const activities = [
    {
        id: "1",
        type: "answer",
        questionId: "101",
        questionTitle: "How to implement authentication with JWT in Node.js?",
        createdAt: "2024-01-15T14:23:00Z"
    },
    {
        id: "2",
        type: "question",
        questionId: "102",
        questionTitle: "Best practices for React component composition",
        createdAt: "2024-01-10T09:15:00Z"
    },
    {
        id: "3",
        type: "badge",
        badgeName: "Good Answer",
        badgeType: "silver",
        createdAt: "2024-01-05T16:45:00Z"
    },
    {
        id: "4",
        type: "comment",
        questionId: "103",
        questionTitle: "How to optimize database queries in PostgreSQL?",
        commentText: "Have you tried using indexes on the columns you're querying frequently?",
        createdAt: "2024-01-03T11:30:00Z"
    },
    {
        id: "5",
        type: "vote",
        questionId: "104",
        questionTitle: "Understanding React Server Components",
        createdAt: "2024-01-01T08:15:00Z"
    },
    {
        id: "6",
        type: "accepted",
        questionId: "105",
        questionTitle: "How to implement dark mode in a React application?",
        createdAt: "2023-12-28T13:45:00Z"
    },
    {
        id: "7",
        type: "tag",
        tagName: "typescript",
        action: "followed",
        createdAt: "2023-12-25T10:20:00Z"
    }
]

// Helper function to get activity icon
const getActivityIcon = (type: string) => {
    switch (type) {
        case "question":
            return <MessageSquare className="h-4 w-4" />
        case "answer":
            return <Edit className="h-4 w-4" />
        case "comment":
            return <MessageSquare className="h-4 w-4" />
        case "vote":
            return <ArrowUp className="h-4 w-4" />
        case "badge":
            return <Award className="h-4 w-4" />
        case "accepted":
            return <Check className="h-4 w-4" />
        case "tag":
            return <Tag className="h-4 w-4" />
        default:
            return <ThumbsUp className="h-4 w-4" />
    }
}

// Helper function to get activity text
const getActivityText = (activity: any) => {
    switch (activity.type) {
        case "question":
            return `You asked a question: "${activity.questionTitle}"`
        case "answer":
            return `You answered a question: "${activity.questionTitle}"`
        case "comment":
            return `You commented on: "${activity.questionTitle}"`
        case "vote":
            return `You voted on: "${activity.questionTitle}"`
        case "badge":
            return `You earned the ${activity.badgeType} badge: ${activity.badgeName}`
        case "accepted":
            return `Your answer was accepted on: "${activity.questionTitle}"`
        case "tag":
            return `You ${activity.action} the tag: ${activity.tagName}`
        default:
            return "Unknown activity"
    }
}

// Helper function to get activity color
const getActivityColor = (type: string) => {
    switch (type) {
        case "question":
            return "text-blue-600"
        case "answer":
            return "text-green-600"
        case "comment":
            return "text-purple-600"
        case "vote":
            return "text-orange-600"
        case "badge":
            return "text-yellow-600"
        case "accepted":
            return "text-green-600"
        case "tag":
            return "text-indigo-600"
        default:
            return "text-gray-600"
    }
}

export function ProfileActivity() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

            {activities.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No recent activity to display.</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className={`mt-1 p-2 rounded-full bg-opacity-10 ${getActivityColor(activity.type).replace('text-', 'bg-')}`}>
                    <span className={getActivityColor(activity.type)}>
                      {getActivityIcon(activity.type)}
                    </span>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm">
                                            {getActivityText(activity)}
                                        </p>

                                        {activity.commentText && (
                                            <p className="mt-1 text-sm text-muted-foreground italic">
                                                "{activity.commentText}"
                                            </p>
                                        )}

                                        {activity.type === "badge" && (
                                            <Badge
                                                className={`mt-2 ${
                                                    activity.badgeType === "gold"
                                                        ? "bg-yellow-500"
                                                        : activity.badgeType === "silver"
                                                            ? "bg-gray-400"
                                                            : "bg-amber-700"
                                                }`}
                                            >
                                                {activity.badgeName}
                                            </Badge>
                                        )}

                                        {activity.type === "tag" && (
                                            <Badge className="mt-2 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                {activity.tagName}
                                            </Badge>
                                        )}

                                        <div className="mt-2 text-xs text-muted-foreground">
                                            {new Date(activity.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>

                                    {(activity.type === "question" || activity.type === "answer" ||
                                        activity.type === "comment" || activity.type === "accepted" ||
                                        activity.type === "vote") && (
                                        <Link
                                            to={`/questions/${activity.questionId}`}
                                            className="text-blue-600 hover:text-blue-800 text-xs self-start mt-1"
                                        >
                                            View
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
