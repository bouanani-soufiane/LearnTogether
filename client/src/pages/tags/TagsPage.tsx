"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, TagIcon, ArrowUpDown, Info } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { TagCard } from "./TagCard"

// Mock data for tags
const tagsData = [
    {
        id: "1",
        name: "javascript",
        description: "For questions about JavaScript, a dynamic, weakly-typed programming language for client-side and server-side development.",
        count: 2345678,
        isWatched: true,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "2",
        name: "python",
        description: "Python is a multi-paradigm, dynamically typed, multipurpose programming language designed to be quick to learn, understand, and use.",
        count: 1987543,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "3",
        name: "react",
        description: "React is a JavaScript library for building user interfaces. It uses a declarative, component-based paradigm and aims to be efficient and flexible.",
        count: 876543,
        isWatched: true,
        isIgnored: false,
        createdAt: "2013-05-29T14:23:00Z"
    },
    {
        id: "4",
        name: "node.js",
        description: "Node.js is an event-based, non-blocking, asynchronous I/O runtime that uses Google's V8 JavaScript engine and libuv library.",
        count: 654321,
        isWatched: false,
        isIgnored: false,
        createdAt: "2009-11-08T14:23:00Z"
    },
    {
        id: "5",
        name: "typescript",
        description: "TypeScript is a superset of JavaScript that compiles to clean JavaScript output. It adds static typing with optional type annotations.",
        count: 543210,
        isWatched: false,
        isIgnored: false,
        createdAt: "2012-10-01T14:23:00Z"
    },
    {
        id: "6",
        name: "css",
        description: "CSS (Cascading Style Sheets) is a representation style sheet language used for describing the look and formatting of HTML, XML, and SVG.",
        count: 432109,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "7",
        name: "html",
        description: "HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications.",
        count: 321098,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "8",
        name: "sql",
        description: "SQL (Structured Query Language) is a language designed for managing data in relational database management systems.",
        count: 210987,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "9",
        name: "next.js",
        description: "Next.js is a React framework that enables server-side rendering, static site generation, and other performance optimizations.",
        count: 198765,
        isWatched: false,
        isIgnored: false,
        createdAt: "2016-10-25T14:23:00Z"
    },
    {
        id: "10",
        name: "tailwindcss",
        description: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
        count: 187654,
        isWatched: false,
        isIgnored: false,
        createdAt: "2017-11-01T14:23:00Z"
    },
    {
        id: "11",
        name: "docker",
        description: "Docker is a platform for developing, shipping, and running applications in containers.",
        count: 176543,
        isWatched: false,
        isIgnored: false,
        createdAt: "2013-03-20T14:23:00Z"
    },
    {
        id: "12",
        name: "aws",
        description: "Amazon Web Services (AWS) is a cloud computing platform that provides a wide range of infrastructure services.",
        count: 165432,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "13",
        name: "git",
        description: "Git is a distributed version control system for tracking changes in source code during software development.",
        count: 154321,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "14",
        name: "mongodb",
        description: "MongoDB is a cross-platform document-oriented NoSQL database program that uses JSON-like documents with optional schemas.",
        count: 143210,
        isWatched: false,
        isIgnored: false,
        createdAt: "2009-02-11T14:23:00Z"
    },
    {
        id: "15",
        name: "redux",
        description: "Redux is a predictable state container for JavaScript apps, often used with React for managing application state.",
        count: 132109,
        isWatched: false,
        isIgnored: false,
        createdAt: "2015-06-02T14:23:00Z"
    },
    {
        id: "16",
        name: "graphql",
        description: "GraphQL is a query language for APIs and a runtime for executing those queries with your existing data.",
        count: 121098,
        isWatched: false,
        isIgnored: false,
        createdAt: "2015-07-02T14:23:00Z"
    },
    {
        id: "17",
        name: "vue.js",
        description: "Vue.js is a progressive JavaScript framework for building user interfaces, focused on declarative rendering and component composition.",
        count: 110987,
        isWatched: false,
        isIgnored: false,
        createdAt: "2014-02-11T14:23:00Z"
    },
    {
        id: "18",
        name: "angular",
        description: "Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google.",
        count: 109876,
        isWatched: false,
        isIgnored: false,
        createdAt: "2010-10-20T14:23:00Z"
    },
    {
        id: "19",
        name: "express",
        description: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
        count: 98765,
        isWatched: false,
        isIgnored: false,
        createdAt: "2010-11-16T14:23:00Z"
    },
    {
        id: "20",
        name: "java",
        description: "Java is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible.",
        count: 987654,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "21",
        name: "c#",
        description: "C# is a general-purpose, multi-paradigm programming language developed by Microsoft as part of its .NET initiative.",
        count: 876543,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "22",
        name: "php",
        description: "PHP is a popular general-purpose scripting language that is especially suited to web development.",
        count: 765432,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "23",
        name: "ios",
        description: "iOS is Apple's mobile operating system for iPhone and iPad devices.",
        count: 654321,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    },
    {
        id: "24",
        name: "android",
        description: "Android is Google's mobile operating system, used for programming or developing digital devices.",
        count: 543210,
        isWatched: false,
        isIgnored: false,
        createdAt: "2008-09-15T14:23:00Z"
    }
];

export default function TagsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("popular")
    const [filterBy, setFilterBy] = useState("all")
    const [tags, setTags] = useState(tagsData)
    const [filteredTags, setFilteredTags] = useState(tagsData)
    const [currentPage, setCurrentPage] = useState(1)
    const tagsPerPage = 12

    // Filter and sort tags based on user selections
    useEffect(() => {
        let result = [...tags]

        // Apply search filter
        if (searchQuery) {
            result = result.filter(tag =>
                tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tag.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            result.sort((a, b) => b.count - a.count)
        } else if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortBy === "newest") {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
    const handleTagAction = (tagId: string, action: 'watch' | 'ignore') => {
        setTags(prevTags =>
            prevTags.map(tag => {
                if (tag.id === tagId) {
                    if (action === 'watch') {
                        return { ...tag, isWatched: !tag.isWatched, isIgnored: false }
                    } else {
                        return { ...tag, isIgnored: !tag.isIgnored, isWatched: false }
                    }
                }
                return tag
            })
        )
    }

    return (
        <div className=" py-6 space-y-6">
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
                            onWatch={() => handleTagAction(tag.id, 'watch')}
                            onIgnore={() => handleTagAction(tag.id, 'ignore')}
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
