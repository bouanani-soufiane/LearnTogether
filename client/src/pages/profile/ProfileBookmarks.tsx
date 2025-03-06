import React from "react"
import { Link } from "react-router-dom"
import { ArrowUp, MessageSquare, Eye, Bookmark } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for bookmarks
const bookmarks = [
    {
        id: "1",
        type: "question",
        title: "Understanding TypeScript generics with React components",
        body: "I'm trying to understand how to properly use TypeScript generics with React components. Specifically, I'm having trouble with...",
        votes: 45,
        answers: 8,
        views: 2345,
        tags: ["typescript", "react", "generics"],
        createdAt: "2023-12-05T10:23:00Z",
        bookmarkedAt: "2023-12-06T14:30:00Z"
    },
    {
        id: "2",
        type: "question",
        title: "How to implement infinite scrolling in React",
        body: "I need to implement infinite scrolling in my React application. I've looked at several libraries but I'm not sure which approach is best...",
        votes: 38,
        answers: 5,
        views: 1876,
        tags: ["react", "infinite-scroll", "performance"],
        createdAt: "2023-11-18T09:15:00Z",
        bookmarkedAt: "2023-11-19T11:45:00Z"
    },
    {
        id: "3",
        type: "answer",
        questionTitle: "Best practices for React project structure",
        body: "When structuring a React project, it's important to consider scalability and maintainability. Here's how I organize my projects...",
        votes: 72,
        isAccepted: true,
        createdAt: "2023-10-12T16:45:00Z",
        bookmarkedAt: "2023-10-13T08:20:00Z",
        tags: ["react", "project-structure", "best-practices"]
    }
]

export function ProfileBookmarks() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
                <Bookmark className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Your Bookmarks</h2>
            </div>

            {bookmarks.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">You haven't bookmarked any content yet.</p>
                    </CardContent>
                </Card>
            ) : (
                bookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="hover:border-blue-200 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 md:w-24">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <ArrowUp className="h-4 w-4" />
                                        <span>{bookmark.votes}</span>
                                    </div>
                                    {bookmark.type === "question" && (
                                        <>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{bookmark.answers}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Eye className="h-4 w-4" />
                                                <span>{bookmark.views}</span>
                                            </div>
                                        </>
                                    )}
                                    {bookmark.type === "answer" && bookmark.isAccepted && (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Accepted</Badge>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">
                                            {bookmark.type === "question" ? "Question" : "Answer"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                      Bookmarked on {new Date(bookmark.bookmarkedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                    </span>
                                    </div>

                                    <Link to={`/questions/${bookmark.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                                        {bookmark.title || bookmark.questionTitle}
                                    </Link>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{bookmark.body}</p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {bookmark.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                {tag}
                                            </Badge>
                                        ))}
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
