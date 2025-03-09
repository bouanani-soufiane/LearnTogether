"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SimpleModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
    footer?: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl"
}

export function SimpleModal({ isOpen, onClose, title, description, children, footer, size = "md" }: SimpleModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            window.addEventListener("keydown", handleEsc)
        }

        return () => {
            window.removeEventListener("keydown", handleEsc)
        }
    }, [isOpen, onClose])

    // Handle outside click
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick)
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [isOpen, onClose])

    // Size classes
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto ">
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    <motion.div
                        ref={modalRef}
                        className={cn(
                            "z-50 w-full rounded-xl border bg-background p-6 shadow-lg",
                            "dark:bg-background/95 dark:backdrop-blur-sm",
                            sizeClasses[size],
                        )}
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 300,
                        }}
                    >
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted/80">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>

                        <div className="py-2">{children}</div>

                        {footer && (
                            <motion.div
                                className="mt-6 flex justify-end space-x-2"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {footer}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

