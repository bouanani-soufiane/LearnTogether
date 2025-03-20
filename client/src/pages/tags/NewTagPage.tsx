// src/pages/tags/NewTagPage.tsx
// This component provides a full page for creating a new tag
import { useToast } from "@/hooks/use-toast"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, AlertTriangle, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTagStore } from "@/store/tagStore"

export default function NewTagPage() {
    const { createTag, isLoading, error } = useTagStore();
    const { toast } = useToast();
    const [tagName, setTagName] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const navigate = useNavigate()

    const validateTag = (name: string): boolean => {
        if (!name.trim()) {
            setFormError("Tag name cannot be empty")
            return false
        }

        if (name.length < 2) {
            setFormError("Tag name must be at least 2 characters")
            return false
        }

        // Tags typically have simple naming rules:
        // - Letters, numbers, and hyphens only
        // - No spaces (use hyphens instead)
        // - Lowercase (we'll convert it anyway)
        const validTagPattern = /^[a-zA-Z0-9-]+$/
        if (!validTagPattern.test(name)) {
            setFormError("Tag name can only contain letters, numbers, and hyphens (no spaces)")
            return false
        }

        setFormError(null)
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateTag(tagName)) {
            return
        }

        try {
            const result = await createTag(tagName)
            if (result) {
                toast({
                    variant: "success",
                    title: "Tag Created",
                    description: `The tag "${result.name}" has been created successfully.`,
                })
                navigate('/tags')
            }
        } catch (err: any) {
            setFormError(err.message || "Failed to create tag")
        }
    }

    return (
        <div className="py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Link to="/tags" className="text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Tags</span>
                    </Link>
                    <h1 className="text-3xl font-bold">Create New Tag</h1>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tag Information</CardTitle>
                    <CardDescription>
                        Tags help categorize questions and make them easier to find. Good tags are concise and descriptive.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {(formError || error) && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {formError || error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="tag-name">Tag Name</Label>
                            <Input
                                id="tag-name"
                                placeholder="e.g., javascript, react, spring-boot"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value.toLowerCase())}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Use hyphens instead of spaces (e.g., "machine-learning" not "machine learning")
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => navigate('/tags')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Tag
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="mt-8 bg-blue-50 border-blue-100">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-medium text-blue-700 mb-2">Tag Creation Guidelines</h3>
                            <div className="text-sm text-blue-700 space-y-2">
                                <p>Creating good tags is important for organizing content effectively:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Use existing tags whenever possible</li>
                                    <li>Make tags specific but not too localized</li>
                                    <li>Avoid creating tags that won't be used frequently</li>
                                    <li>Check for similar tags before creating new ones</li>
                                </ul>
                            </div>
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