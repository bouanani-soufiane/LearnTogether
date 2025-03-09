"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Search, Menu, Bell, MessageSquare, User, LogOut, Settings, UserCircle } from 'lucide-react'

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showUserDropdown, setShowUserDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Searching for:", searchQuery)
    }

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu)
    }

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown)
    }

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-sky-100/50">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and hamburger menu */}
                    <div className="flex items-center">
                        <button
                            className="mr-3 md:hidden text-gray-600 hover:text-sky-600 transition-colors"
                            onClick={toggleMobileMenu}
                        >
                            <Menu size={20} />
                        </button>
                        <Link to="/" className="flex items-center">
                            <div className="hidden sm:flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-orange-400 flex items-center justify-center shadow-sm mr-2">
                                    <span className="text-white text-sm font-bold">LT</span>
                                </div>
                                <span className="font-bold text-2xl bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
                                    LearnTogether
                                </span>
                            </div>
                            <div className="sm:hidden h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-orange-400 flex items-center justify-center shadow-sm">
                                <span className="text-white text-sm font-bold">LT</span>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full py-2 pr-10 pl-4 border border-sky-100 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-orange-500 transition-colors"
                            >
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <button className="text-gray-600 hover:text-sky-600 transition-colors p-2 rounded-full hover:bg-sky-50">
                                    <Bell size={18} />
                                </button>
                                <button className="text-gray-600 hover:text-sky-600 transition-colors p-2 rounded-full hover:bg-sky-50">
                                    <MessageSquare size={18} />
                                </button>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        className="flex items-center gap-2 text-gray-700 hover:text-sky-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-sky-50"
                                        onClick={toggleUserDropdown}
                                    >
                                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-500 to-orange-400 flex items-center justify-center shadow-sm text-white text-xs font-medium">
                                            {user?.fullName?.charAt(0) || "U"}
                                        </div>
                                        <span className="text-sm font-medium truncate max-w-[100px]">
                                            {user?.fullName || "User"}
                                        </span>
                                    </button>
                                    {showUserDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg py-2 z-10 border border-sky-100/50 overflow-hidden">
                                            <div className="px-4 py-2 border-b border-sky-100/50">
                                                <p className="text-sm font-medium text-gray-700">{user?.fullName || "User"}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 transition-colors"
                                            >
                                                <User size={16} className="text-sky-500" />
                                                Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 transition-colors"
                                            >
                                                <Settings size={16} className="text-sky-500" />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout()
                                                    navigate("/login")
                                                    setShowUserDropdown(false)
                                                }}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 transition-colors"
                                            >
                                                <LogOut size={16} className="text-orange-500" />
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sky-600 hover:text-sky-700 px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        {isAuthenticated ? (
                            <button
                                className="text-gray-600 hover:text-sky-600 transition-colors"
                                onClick={toggleUserDropdown}
                            >
                                <UserCircle size={24} />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                            >
                                Log in
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm pt-2 pb-3 border-t border-sky-100/50 shadow-sm">
                    <div className="px-2 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/questions"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                        >
                            Questions
                        </Link>
                        <Link
                            to="/tags"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                        >
                            Tags
                        </Link>
                        <Link
                            to="/users"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                        >
                            Users
                        </Link>
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout()
                                    navigate("/login")
                                }}
                                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                            >
                                Sign out
                            </button>
                        ) : (
                            <Link
                                to="/register"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                            >
                                Sign up
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile user dropdown */}
            {isAuthenticated && showUserDropdown && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm pt-2 pb-3 border-t border-sky-100/50 shadow-sm">
                    <div className="px-2 space-y-1">
                        <div className="px-3 py-2 mb-2 border-b border-sky-100/50">
                            <p className="text-sm font-medium text-gray-700">{user?.fullName || "User"}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                        </div>
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                        >
                            <User size={18} className="text-sky-500" />
                            Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
                        >
                            <Settings size={18} className="text-sky-500" />
                            Settings
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
