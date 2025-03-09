"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { SimpleModal } from "./SimpleModal"

// Define the UserProfile type if it's not imported
interface UserProfile {
    bio: string | null
    location: string | null
    websiteLink: string | null
    birthdate: string | null
}

// Mock profile store if not available
const useProfileStore = () => {
    const [isProfileLoading, setIsProfileLoading] = useState(false)

    const updateProfile = async (userId: number, data: any) => {
        setIsProfileLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsProfileLoading(false)
        return data
    }

    return { updateProfile, isProfileLoading }
}

const profileSchema = z.object({
    bio: z.string().max(500, "Bio must be 500 characters or less").nullable(),
    location: z.string().max(100, "Location must be 100 characters or less").nullable(),
    websiteLink: z.string().url("Please enter a valid URL").or(z.string().length(0)).nullable(),
    birthdate: z.date().nullable(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    userId: number
    profile: UserProfile
}

export function EditProfileModal({ isOpen, onClose, userId, profile }: EditProfileModalProps) {
    const { updateProfile, isProfileLoading } = useProfileStore()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        watch,
        reset,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: profile.bio || "",
            location: profile.location || "",
            websiteLink: profile.websiteLink || "",
            birthdate: profile.birthdate ? new Date(profile.birthdate) : null,
        },
    })

    const birthdateValue = watch("birthdate")

    const onSubmit = async (data: ProfileFormValues) => {
        setError(null)
        setSuccess(false)

        try {
            // Make sure birthdate is in the right format if it exists
            const formattedData = {
                ...data,
                birthdate: data.birthdate ? format(data.birthdate, "yyyy-MM-dd") : null,
            }

            await updateProfile(userId, formattedData)
            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (err: any) {
            setError(err.message || "Failed to update profile")
        }
    }

    const handleDateSelect = (date: Date | undefined) => {
        setValue("birthdate", date || null, { shouldDirty: true })
        setShowCalendar(false)
    }

    // Footer buttons for the modal
    const modalFooter = (
        <>
            <Button type="button" variant="outline" onClick={onClose}>
                Cancel
            </Button>
            <Button
                form="profile-form"
                type="submit"
                disabled={isProfileLoading || !isDirty}
                className="relative overflow-hidden"
            >
                {isProfileLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save Changes"
                )}

                {/* Button highlight effect */}
                {isDirty && !isProfileLoading && (
                    <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.5,
                            repeatType: "reverse",
                        }}
                    />
                )}
            </Button>
        </>
    )

    return (
        <SimpleModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            description="Update your profile information. Click save when you're done."
            footer={modalFooter}
            size="lg"
        >
            <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                        About Me
                    </Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        className="min-h-[120px] resize-none transition-all focus-visible:ring-primary/70"
                        {...register("bio")}
                    />
                    {errors.bio && (
                        <motion.p
                            className="text-sm text-destructive mt-1"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {errors.bio.message}
                        </motion.p>
                    )}
                    <div className="text-xs text-muted-foreground text-right">{watch("bio")?.length || 0}/500</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">
                            Location
                        </Label>
                        <Input
                            id="location"
                            placeholder="City, Country"
                            className="transition-all focus-visible:ring-primary/70"
                            {...register("location")}
                        />
                        {errors.location && (
                            <motion.p
                                className="text-sm text-destructive mt-1"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {errors.location.message}
                            </motion.p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="websiteLink" className="text-sm font-medium">
                            Website
                        </Label>
                        <Input
                            id="websiteLink"
                            placeholder="https://yourwebsite.com"
                            className="transition-all focus-visible:ring-primary/70"
                            {...register("websiteLink")}
                        />
                        {errors.websiteLink && (
                            <motion.p
                                className="text-sm text-destructive mt-1"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {errors.websiteLink.message}
                            </motion.p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="birthdate" className="text-sm font-medium">
                        Birthdate
                    </Label>
                    <div className="relative">
                        <Button
                            type="button"
                            id="birthdate"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {birthdateValue ? (
                                format(birthdateValue, "PPP")
                            ) : (
                                <span className="text-muted-foreground">Pick a date</span>
                            )}
                        </Button>

                        <AnimatePresence>
                            {showCalendar && (
                                <motion.div
                                    className="absolute z-50 mt-2 bg-background border rounded-xl shadow-lg overflow-hidden"
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{
                                        type: "spring",
                                        damping: 20,
                                        stiffness: 300,
                                    }}
                                    style={{ width: "calc(100% + 80px)" }}
                                >
                                    <div className="p-3">
                                        <Calendar
                                            mode="single"
                                            selected={birthdateValue || undefined}
                                            onSelect={handleDateSelect}
                                            className="rounded-md border"

                                            initialFocus
                                        />
                                    </div>
                                    <div className="p-2 border-t flex justify-between items-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setValue("birthdate", null)
                                                setShowCalendar(false)
                                            }}
                                        >
                                            Clear
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={() => setShowCalendar(false)}>
                                            Close
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {error && (
                    <motion.div
                        className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        className="bg-green-50 text-green-600 p-4 rounded-lg text-sm flex items-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Profile updated successfully!
                    </motion.div>
                )}
            </form>
        </SimpleModal>
    )
}

