// src/pages/tags/TagsPage.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, ArrowUpDown, Info, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TagCard } from "./TagCard"
import { useTagStore } from "@/store/tagStore"

export default function TagsPage() {
    const { tags, isLoading, error, fetchTags, watchTag, ignoreTag, resetTagPreference } = useTagStore();

    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("popular")
    const [filterBy, setFilterBy] = useState("all")
    const [filteredTags, setFilteredTags] = useState(tags)
    const [currentPage, setCurrentPage] = useState(1)
    const tagsPerPage = 12

    // Fetch tags on component mount
    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    // Filter and sort tags based on user selections
    useEffect(() => {
        if (!tags) return;

        let result = [...tags]

        // Apply search filter
        if (searchQuery) {
            result = result.filter(tag =>
                tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        // Apply tag filter
        if (filterBy === "watched") {
            result = result.filter(tag => tag.isWatched)
        } else if (filterBy === "ignored") {
            result = result.filter(tag => tag.isIgnored)
        }

        // Apply sorting
        if (sortBy === "popular") {
            result.sort((a, b) => (b.count || 0) - (a.count || 0))
        } else if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortBy === "newest") {
            result.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            })
        }

        setFilteredTags(result)
        setCurrentPage(1) // Reset to first page when filters change
    }, [searchQuery, sortBy, filterBy, tags])

    // Calculate pagination
    const indexOfLastTag = currentPage * tagsPerPage
    const indexOfFirstTag = indexOfLastTag - tagsPerPage
    const currentTags = filteredTags.slice(indexOfFirstTag, indexOfLastTag)
    const totalPages = Math.ceil(filteredTags.length / tagsPerPage)

    // Handle tag watch/ignore toggle
    const handleTagAction = (tagId: number, action: 'watch' | 'ignore' | 'reset') => {
        if (action === 'watch') {
            watchTag(tagId);
        } else if (action === 'ignore') {
            ignoreTag(tagId);
        } else {
            resetTagPreference(tagId);
        }
    }

    // Loading state
    if (isLoading && tags.length === 0) {
        return (
            <div className="py-6 space-y-6">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                        <p className="text-muted-foreground">Loading tags...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="py-6 space-y-6">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Tags</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={() => fetchTags()}>Try Again</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Tags</h1>
                        <p className="text-muted-foreground mt-1">
                            A tag is a keyword or label that categorizes your question with other, similar questions.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to="/tags/synonyms"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Synonyms
                        </Link>
                        <Link
                            to="/tags/new"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            New
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Filter by tag name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Select value={filterBy} onValueChange={setFilterBy}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tags</SelectItem>
                                <SelectItem value="watched">Watched Tags</SelectItem>
                                <SelectItem value="ignored">Ignored Tags</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[150px]">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popular">Popular</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Tags Grid */}
            {filteredTags.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No tags found matching your criteria.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentTags.map((tag) => (
                        <TagCard
                            key={tag.id}
                            tag={tag}
                            onWatch={() => {
                                if (tag.isWatched) {
                                    handleTagAction(tag.id, 'reset');
                                } else {
                                    handleTagAction(tag.id, 'watch');
                                }
                            }}
                            onIgnore={() => {
                                if (tag.isIgnored) {
                                    handleTagAction(tag.id, 'reset');
                                } else {
                                    handleTagAction(tag.id, 'ignore');
                                }
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show 5 page buttons at most
                            let pageNum = currentPage <= 3
                                ? i + 1
                                : currentPage >= totalPages - 2
                                    ? totalPages - 4 + i
                                    : currentPage - 2 + i;

                            // Ensure we don't show pages below 1 or above totalPages
                            if (pageNum < 1) pageNum = 1;
                            if (pageNum > totalPages) pageNum = totalPages;

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className="w-9"
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <Card className="mt-8 bg-blue-50 border-blue-100">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-medium text-blue-700 mb-2">About Tags</h3>
                            <p className="text-sm text-blue-700">
                                Tags help categorize questions and make them easier to find. Using the right tags helps others discover and answer your question.
                            </p>
                            <div className="mt-4">
                                <Link to="/help/tagging" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Learn more about tagging
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}