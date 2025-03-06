"use client"

import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { Award, Calendar, Edit3, GitlabIcon as GitHub, Globe, Link2, MapPin, MessageSquare, Settings, Twitter, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileQuestions } from "./ProfileQuestions"
import { ProfileAnswers } from "./ProfileAnswers"
import { ProfileActivity } from "./ProfileActivity"
import { ProfileBookmarks } from "./ProfileBookmarks"

// Mock user data - in a real app, this would come from an API
const userData = {
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    avatar: "/placeholder.svg?height=200&width=200",
    reputation: 12453,
    location: "San Francisco, CA",
    title: "Senior Software Engineer",
    website: "https://johndoe.dev",
    github: "johndoe",
    twitter: "johndoe",
    joinDate: "2020-05-15",
    about: "Full-stack developer with 8+ years of experience in React, Node.js, and TypeScript. Passionate about building accessible and performant web applications.",
    stats: {
        questions: 42,
        answers: 156,
        reached: "~1.2m",
        badges: {
            gold: 3,
            silver: 24,
            bronze: 78
        }
    }
}

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>()
    const [activeTab, setActiveTab] = useState("questions")
    const isOwnProfile = userData.username === username || !username

    // In a real app, you would fetch user data based on the username
    const user = userData

    return (
        <div className="py-6 space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 flex flex-col items-center">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.avatar} alt={user.fullName} />
                                    <AvatarFallback className="text-4xl">{user.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className="mt-4 text-2xl font-bold">{user.fullName}</h1>
                                <p className="text-muted-foreground">{user.title}</p>

                                <div className="mt-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{user.location}</span>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    {isOwnProfile && (
                                        <Button variant="outline" size="sm">
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    )}
                                    {isOwnProfile && (
                                        <Button variant="outline" size="sm">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </Button>
                                    )}
                                    {!isOwnProfile && (
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Message
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Member since {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {user.website && (
                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </a>
                                    )}
                                    {user.github && (
                                        <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                            <GitHub className="h-4 w-4" />
                                            GitHub
                                        </a>
                                    )}
                                    {user.twitter && (
                                        <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                            <Twitter className="h-4 w-4" />
                                            Twitter
                                        </a>
                                    )}
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-sm font-medium mb-2">About</h3>
                                    <p className="text-sm text-muted-foreground">{user.about}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:w-3/4 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold text-orange-500">{user.reputation.toLocaleString()}</span>
                                    <span className="text-sm text-muted-foreground">Reputation</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold">{user.stats.reached}</span>
                                    <span className="text-sm text-muted-foreground">People reached</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold">{user.stats.questions}</span>
                                    <span className="text-sm text-muted-foreground">Questions</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold">{user.stats.answers}</span>
                                    <span className="text-sm text-muted-foreground">Answers</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Badges */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                                <Award className="h-5 w-5 mr-2 text-blue-500" />
                                Badges
                            </h3>

                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600">{user.stats.badges.gold}</Badge>
                                    <span className="text-sm">Gold</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge className="bg-gray-400 hover:bg-gray-500">{user.stats.badges.silver}</Badge>
                                    <span className="text-sm">Silver</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge className="bg-amber-700 hover:bg-amber-800">{user.stats.badges.bronze}</Badge>
                                    <span className="text-sm">Bronze</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Tabs */}
                    <Tabs defaultValue="questions" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-6">
                            <TabsTrigger value="questions">Questions</TabsTrigger>
                            <TabsTrigger value="answers">Answers</TabsTrigger>
                            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="questions">
                            <ProfileQuestions />
                        </TabsContent>

                        <TabsContent value="answers">
                            <ProfileAnswers />
                        </TabsContent>

                        <TabsContent value="bookmarks">
                            <ProfileBookmarks />
                        </TabsContent>

                        <TabsContent value="activity">
                            <ProfileActivity />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
