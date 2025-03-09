// src/pages/tags/TagCard.tsx
import React from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Info } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TagCardProps {
    tag: {
        id: number
        name: string
        description?: string
        count?: number
        isWatched?: boolean
        isIgnored?: boolean
        createdAt?: string
    }
    onWatch: () => void
    onIgnore: () => void
}

export function TagCard({ tag, onWatch, onIgnore }: TagCardProps) {
    // Format the count with k, m for thousands and millions
    const formatCount = (count: number = 0) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}m`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`
        } else {
            return count.toString()
        }
    }

    return (
        <Card className={`hover:border-blue-200 transition-colors ${tag.isWatched ? 'border-l-4 border-l-blue-500' : tag.isIgnored ? 'border-l-4 border-l-red-500 opacity-60' : ''}`}>
            <CardContent className="p-5">
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                        <Link
                            to={`/tags/${tag.name}`}
                            className="flex items-center gap-2"
                        >
                            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1">
                                {tag.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {formatCount(tag.count)} questions
                            </span>
                        </Link>

                        <div className="flex gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-7 w-7 ${tag.isWatched ? 'text-blue-600' : 'text-muted-foreground'}`}
                                            onClick={onWatch}
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">{tag.isWatched ? 'Unwatch tag' : 'Watch tag'}</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tag.isWatched ? 'Unwatch tag' : 'Watch tag'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-7 w-7 ${tag.isIgnored ? 'text-red-600' : 'text-muted-foreground'}`}
                                            onClick={onIgnore}
                                        >
                                            <EyeOff className="h-4 w-4" />
                                            <span className="sr-only">{tag.isIgnored ? 'Unignore tag' : 'Ignore tag'}</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tag.isIgnored ? 'Unignore tag' : 'Ignore tag'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground"
                                            asChild
                                        >
                                            <Link to={`/tags/${tag.name}`}>
                                                <Info className="h-4 w-4" />
                                                <span className="sr-only">Tag info</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View tag info</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                        {tag.description || `Tag for ${tag.name} related questions.`}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                        <Link
                            to={`/tags/${tag.name}`}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            Learn more
                        </Link>

                        <Link
                            to={`/questions/tagged/${tag.name}`}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            Browse questions
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}