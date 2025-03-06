
import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff, Info, BarChart2, Calendar, Users, MessageSquare } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock data for a specific tag
const tagData = {
    name: "react",
    description: "React is a JavaScript library for building user interfaces. It uses a declarative, component-based paradigm and aims to be efficient and flexible.",
    longDescription: "React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta (formerly Facebook) and a community of individual developers and companies. React can be used to develop single-page, mobile, or server-rendered applications with frameworks like Next.js. React is only concerned with the user interface and rendering components to the DOM, so creating React applications usually requires the use of additional libraries for routing, as well as certain client-side functionality.",
    count: 876543,
    isWatched: true,
    isIgnored: false,
    createdAt: "2013-05-29T14:23:00Z",
    stats: {
        asked: 876543,
        answered: 743210,
        unanswered: 133333,
        acceptedRate: 67,
        topUsers: [
            { id: "1", name: "John Doe", reputation: 123456, count: 543 },
            { id: "2", name: "Jane Smith", reputation: 98765, count: 421 },
            { id: "3", name: "Bob Johnson", reputation: 87654, count: 387 }
        ],
        relatedTags: [
            { name: "javascript", count: 543210 },
            { name: "jsx", count: 321098 },
            { name: "react-hooks", count: 210987 },
            { name: "redux", count: 198765 },
            { name: "next.js", count: 176543 }
        ]
    }
}

// Mock data for questions with this tag
const questionsData = [
    {
        id: "1",
        title: "How to implement authentication with React and Firebase?",
        body: "I'm trying to implement authentication in my React application using Firebase but I'm running into issues with the user session management...",
        votes: 24,
        answers: 3,
        views: 1243,
        tags: ["react", "firebase", "authentication"],
        createdAt: "2023-11-15T14:23:00Z",
        user: { id: "1", name: "John Doe", reputation: 12345 }
    },
    {
        id: "2",
        title: "Best practices for state management in large React applications",
        body: "I'm working on a large-scale React application and I'm wondering what are the current best practices for state management...",
        votes: 42,
        answers: 7,
        views: 3521,
        tags: ["react", "redux", "state-management"],
        createdAt: "2023-10-22T09:15:00Z",
        user: { id: "2", name: "Jane Smith", reputation: 23456 }
    },
    {
        id: "3",
        title: "How to optimize performance in React with useMemo and useCallback",
        body: "I'm trying to understand when I should use useMemo and useCallback hooks to optimize my React components...",
        votes: 18,
        answers: 5,
        views: 982,
        tags: ["react", "performance", "hooks"],
        createdAt: "2023-09-05T16:45:00Z",
        user: { id: "3", name: "Bob Johnson", reputation: 34567 }
    },
    {
        id: "4",
        title: "React Server Components vs. Client Components",
        body: "What are the main differences between React Server Components and Client Components? When should I use each one?",
        votes: 36,
        answers: 4,
        views: 1876,
        tags: ["react", "server-components", "next.js"],
        createdAt: "2023-08-12T11:30:00Z",
        user: { id: "4", name: "Alice Williams", reputation: 45678 }
    },
    {
        id: "5",
        title: "How to handle form validation in React?",
        body: "I'm building a form in React and need to implement validation. What are the best libraries or approaches for this?",
        votes: 29,
        answers: 6,
        views: 2143,
        tags: ["react", "forms", "validation"],
        createdAt: "2023-07-28T08:45:00Z",
        user: { id: "5", name: "Charlie Brown", reputation: 56789 }
    }
]

export default function TagDetailPage() {
    const { tagName } = useParams<{ tagName: string }>()
    const [activeTab, setActiveTab] = useState("info")
    const [tag, setTag] = useState(tagData)
    const [questions, setQuestions] = useState(questionsData)
    const [isWatched, setIsWatched] = useState(tag.isWatched)
    const [isIgnored, setIsIgnored] = useState(tag.isIgnored)

    // In a real app, you would fetch tag data and questions based on the tagName
    useEffect(() => {
        // Fetch tag data and questions
        // This is just a mock implementation
        console.log(`Fetching data for tag: ${tagName}`)
    }, [tagName])

    const handleWatchToggle = () => {
        setIsWatched(!isWatched)
        setIsIgnored(false)
        // In a real app, you would call an API to update the user's preferences
    }

    const handleIgnoreToggle = () => {
        setIsIgnored(!isIgnored)
        setIsWatched(false)
        // In a real app, you would call an API to update the user's preferences
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Link to="/tags" className="text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Tags</span>
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-lg">
                            {tag.name}
                        </Badge>
                        <span className="text-xl text-muted-foreground">
              {tag.count.toLocaleString()} questions
            </span>
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={isWatched ? "default" : "outline"}
                        size="sm"
                        onClick={handleWatchToggle}
                        className={isWatched ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        {isWatched ? "Watching" : "Watch Tag"}
                    </Button>

                    <Button
                        variant={isIgnored ? "default" : "outline"}
                        size="sm"
                        onClick={handleIgnoreToggle}
                        className={isIgnored ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        <EyeOff className="h-4 w-4 mr-2" />
                        {isIgnored ? "Ignoring" : "Ignore Tag"}
                    </Button>

                    <Link to={`/questions/ask?tags=${tag.name}`}>
                        <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ask Question
                        </Button>
                    </Link>
                </div>

                <p className="text-muted-foreground">
                    {tag.description}
                </p>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="newest">Newest</TabsTrigger>
                    <TabsTrigger value="frequent">Frequent</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-blue-500" />
                                        About {tag.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{tag.longDescription}</p>

                                    <Separator className="my-4" />

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Created</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(tag.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Questions</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MessageSquare className="h-4 w-4" />
                                                {tag.count.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart2 className="h-5 w-5 text-blue-500" />
                                        Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 rounded-md p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-700">{tag.stats.asked.toLocaleString()}</div>
                                            <div className="text-sm text-blue-600">Questions</div>
                                        </div>

                                        <div className="bg-green-50 rounded-md p-4 text-center">
                                            <div className="text-2xl font-bold text-green-700">{tag.stats.answered.toLocaleString()}</div>
                                            <div className="text-sm text-green-600">Answered</div>
                                        </div>

                                        <div className="bg-amber-50 rounded-md p-4 text-center">
                                            <div className="text-2xl font-bold text-amber-700">{tag.stats.acceptedRate}%</div>
                                            <div className="text-sm text-amber-600">Acceptance Rate</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-500" />
                                        Top Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {tag.stats.topUsers.map((user) => (
                                            <div key={user.id} className="flex justify-between items-center">
                                                <Link to={`/profile/${user.id}`} className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{user.reputation.toLocaleString()} reputation</div>
                                                    </div>
                                                </Link>
                                                <div className="text-sm text-muted-foreground">
                                                    {user.count} posts
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Related Tags</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {tag.stats.relatedTags.map((relatedTag) => (
                                            <div key={relatedTag.name} className="flex justify-between items-center">
                                                <Link to={`/tags/${relatedTag.name}`}>
                                                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                        {relatedTag.name}
                                                    </Badge>
                                                </Link>
                                                <span className="text-xs text-muted-foreground">
                          {relatedTag.count.toLocaleString()}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="newest">
                    <div className="space-y-4">
                        {questions.map((question) => (
                            <Card key={question.id} className="hover:border-blue-200 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 md:w-24">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <span>{question.votes}</span>
                                                <span className="text-xs">votes</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <span>{question.answers}</span>
                                                <span className="text-xs">answers</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <span>{question.views}</span>
                                                <span className="text-xs">views</span>
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

                                            <div className="mt-4 flex justify-between items-center">
                                                <div className="text-xs text-muted-foreground">
                                                    Asked on {new Date(question.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                </div>
                                                <Link to={`/profile/${question.user.id}`} className="text-xs text-blue-600 hover:text-blue-800">
                                                    {question.user.name} ({question.user.reputation.toLocaleString()})
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-center mt-4">
                            <Link to={`/questions/tagged/${tag.name}`}>
                                <Button variant="outline">
                                    View all questions
                                </Button>
                            </Link>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="frequent">
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <p className="text-muted-foreground">
                                    Showing the most frequently asked questions with the {tag.name} tag.
                                </p>
                            </CardContent>
                        </Card>

                        {/* We would show different questions here, but for the demo we'll use the same ones */}
                        {questions.map((question) => (
                            <Card key={question.id} className="hover:border-blue-200 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 md:w-24">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <span>{question.votes}</span>
                                                <span className="text-xs">votes</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <span>{question.answers}</span>
                                                <span className="text-xs">answers</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <span>{question.views}</span>
                                                <span className="text-xs">views</span>
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

                                            <div className="mt-4 flex justify-between items-center">
                                                <div className="text-xs text-muted-foreground">
                                                    Asked on {new Date(question.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                </div>
                                                <Link to={`/profile/${question.user.id}`} className="text-xs text-blue-600 hover:text-blue-800">
                                                    {question.user.name} ({question.user.reputation.toLocaleString()})
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
