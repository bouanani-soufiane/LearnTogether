// src/pages/profile/ProfilePage.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Award, Calendar, Edit3, GitlabIcon as GitHub, Globe, Link2, MapPin, MessageSquare, Settings, Twitter, User, Loader2 } from 'lucide-react'

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
import { useProfileStore } from "@/store/profileStore"
import { useAuthStore } from "@/store/authStore"

import { EditProfileModal } from "@/components/user/EditProfileModal";


export default function ProfilePage() {
    const { username } = useParams<{ username: string }>()
    const [activeTab, setActiveTab] = useState("questions")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { user: currentUser } = useAuthStore()
    const {
        currentProfile,
        profileStats,
        isProfileLoading,
        profileError,
        fetchProfileById
    } = useProfileStore()

    // Fetch profile data when component mounts
    useEffect(() => {
        if (currentUser) {
            // If viewing own profile or no username provided
            if (!username || username === currentUser.email.split('@')[0]) {
                fetchProfileById(currentUser.id);
            }
        }
    }, [username, currentUser, fetchProfileById]);

    // Check if this is the current user's own profile
    const isOwnProfile =
        (currentUser && currentProfile && currentUser.id === currentProfile.id) ||
        (!username && currentUser);

    // Loading state
    if (isProfileLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">Loading profile...</span>
            </div>
        );
    }

    // Error state
    if (profileError) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-500 text-lg">Error loading profile</div>
                <p className="text-gray-600 mt-2">{profileError}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    // No profile data
    if (!currentProfile) {
        return (
            <div className="p-6 text-center">
                <div className="text-lg">Profile not found</div>
                <p className="text-gray-600 mt-2">The requested profile could not be found.</p>
            </div>
        );
    }

    // Calculate reputation based on badges (if available)
    const reputation = profileStats?.badges ?
        (profileStats.badges.gold * 50 + profileStats.badges.silver * 10 + profileStats.badges.bronze * 2) :
        Math.floor(Math.random() * 10000);

    return (
        <div className="py-6 space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 flex flex-col items-center">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                    <AvatarImage src="/placeholder.svg?height=200&width=200" alt={currentProfile.fullName} />
                                    <AvatarFallback className="text-4xl">{currentProfile.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className="mt-4 text-2xl font-bold">{currentProfile.fullName}</h1>
                                <p className="text-muted-foreground">{currentProfile.role}</p>

                                {currentProfile.profile.location && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">{currentProfile.profile.location}</span>
                                    </div>
                                )}

                                <div className="mt-4 flex gap-2">
                                    {isOwnProfile && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    )}

                                    {isOwnProfile && currentProfile && (
                                        <EditProfileModal
                                            isOpen={isEditModalOpen}
                                            onClose={() => setIsEditModalOpen(false)}
                                            userId={currentProfile.id}
                                            profile={currentProfile.profile}
                                        />
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
                                    <span className="text-sm">
                                        Member since {new Date(currentProfile.profile.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {currentProfile.profile.websiteLink && (
                                        <a href={currentProfile.profile.websiteLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </a>
                                    )}
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-sm font-medium mb-2">About</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {currentProfile.profile.bio || "No bio available"}
                                    </p>
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
                                    <span className="text-3xl font-bold text-orange-500">{reputation.toLocaleString()}</span>
                                    <span className="text-sm text-muted-foreground">Reputation</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold">{profileStats?.reached || "~0"}</span>
                                    <span className="text-sm text-muted-foreground">People reached</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold">{profileStats?.questions || 0}</span>
                                    <span className="text-sm text-muted-foreground">Questions</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold">{profileStats?.answers || 0}</span>
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
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                                        {profileStats?.badges?.gold || 0}
                                    </Badge>
                                    <span className="text-sm">Gold</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge className="bg-gray-400 hover:bg-gray-500">
                                        {profileStats?.badges?.silver || 0}
                                    </Badge>
                                    <span className="text-sm">Silver</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge className="bg-amber-700 hover:bg-amber-800">
                                        {profileStats?.badges?.bronze || 0}
                                    </Badge>
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
                            <ProfileQuestions userId={currentProfile.id} />
                        </TabsContent>

                        <TabsContent value="answers">
                            <ProfileAnswers userId={currentProfile.id} />
                        </TabsContent>

                        <TabsContent value="bookmarks">
                            <ProfileBookmarks userId={currentProfile.id} />
                        </TabsContent>

                        <TabsContent value="activity">
                            <ProfileActivity userId={currentProfile.id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}