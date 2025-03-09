"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
    Shield,
    UserX,
    Edit,
    Mail,
    Download,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { useUserStore } from "@/store/userStore"
import { User } from "@/services/userService"
import {EditProfileModal} from "@/components/user/EditProfileModal";


type SortField = "fullName" | "role" | "status" | "joinedAt" | "lastActive"
type SortDirection = "asc" | "desc"

const AdminUsersPage = () => {
    const navigate = useNavigate()
    const {
        users,
        usersResponse,
        isUsersLoading,
        usersError,
        fetchUsers,
        updateUserProfile,
        deleteUser,
        isProcessing,
        processError,
        clearErrors,
    } = useUserStore()

    const [searchQuery, setSearchQuery] = useState("")
    // @ts-ignore
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [sortField, setSortField] = useState<SortField>("joinedAt")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const usersPerPage = 10
    const totalPages = usersResponse ? usersResponse.totalPages : 1

    // Fetch users on initial load
    useEffect(() => {
        fetchUsers(currentPage, usersPerPage)
    }, [currentPage, usersPerPage, fetchUsers])

    // Filter users
    useEffect(() => {
        if (!users) return

        let result = [...users]

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (user) => user.fullName.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
            )
        }

        // Apply role filter
        if (selectedRole) {
            result = result.filter((user) => user.role === selectedRole)
        }

        // Apply status filter
        if (selectedStatus) {
            result = result.filter((user) => user.status === selectedStatus)
        }

        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0

            switch (sortField) {
                case "fullName":
                    comparison = a.fullName.localeCompare(b.fullName)
                    break
                case "role":
                    comparison = a.role.localeCompare(b.role)
                    break
                case "status":
                    comparison = a.status.localeCompare(b.status)
                    break
                case "joinedAt":
                    comparison = new Date(a.profile.joinedAt).getTime() - new Date(b.profile.joinedAt).getTime()
                    break
                default:
                    comparison = 0
            }

            return sortDirection === "asc" ? comparison : -comparison
        })

        setFilteredUsers(result)
    }, [searchQuery, users, selectedRole, selectedStatus, sortField, sortDirection])

    // Handle sort toggle
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    // Handle user selection
    const toggleUserSelection = (userId: number) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId))
        } else {
            setSelectedUsers([...selectedUsers, userId])
        }
    }

    // Handle select all
    const toggleSelectAll = () => {
        if (isSelectAll) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id))
        }
        setIsSelectAll(!isSelectAll)
    }

    // Reset filters
    const resetFilters = () => {
        setSearchQuery("")
        setSelectedRole(null)
        setSelectedStatus(null)
        setSortField("joinedAt")
        setSortDirection("desc")
    }

    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM d, yyyy")
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        fetchUsers(page, usersPerPage)
    }

    // Handle edit user
    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setIsEditModalOpen(true)
    }

    // Handle update profile
    const handleUpdateProfile = async (userId: number, profileData: any) => {
        await updateUserProfile(userId, profileData)
        setIsEditModalOpen(false)
    }

    // Get status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
                        {status}
          </span>
                )
            case "Suspended":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
                        {status}
          </span>
                )
            case "Pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
                        {status}
          </span>
                )
            default:
                return <span>{status}</span>
        }
    }

    // Get role badge
    const getRoleBadge = (role: string) => {
        switch (role) {
            case "ADMIN":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Admin
          </span>
                )
            case "MODERATOR":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Moderator
          </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            User
          </span>
                )
        }
    }

    // Handle delete user
    const handleDeleteUser = async (userId: number) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteUser(userId)
                // No need to update state as the store will handle it
            } catch (error) {
                console.error("Failed to delete user:", error)
            }
        }
    }

    // Handle toggle suspension
    const handleToggleSuspension = async (user: User) => {
        const newStatus = user.status === "Suspended" ? "Active" : "Suspended"
        if (
            window.confirm(`Are you sure you want to ${user.status === "Suspended" ? "unsuspend" : "suspend"} this user?`)
        ) {
            try {
                // This is a placeholder - you would need to implement this API call
                // await updateUserStatus(user.id, newStatus);
                alert(`User would be ${newStatus.toLowerCase()}. API call not implemented.`)
            } catch (error) {
                console.error("Failed to update user status:", error)
            }
        }
    }

    return (
        <div className="pt-16">
            <div className="max-w-screen-xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
                            User Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage all users and their permissions</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 rounded-xl text-sky-600 hover:bg-sky-50 transition-colors shadow-sm"
                            onClick={() => navigate("/admin/users/new")}
                        >
                            <Shield size={16} />
                            <span>Add User</span>
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 rounded-xl text-sky-600 hover:bg-sky-50 transition-colors shadow-sm"
                            onClick={() => {}}
                        >
                            <Download size={16} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="bg-white rounded-xl shadow-sm border border-sky-100/50 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                className="w-full py-2 pr-10 pl-10 border border-sky-100 bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            {searchQuery && (
                                <button
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <XCircle size={18} />
                                </button>
                            )}
                        </div>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-sky-200 rounded-xl text-sky-600 hover:bg-sky-50 transition-colors"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={16} />
                            <span>Filters</span>
                            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-sky-100/50 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full py-2 px-3 border border-sky-100 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
                                    value={selectedRole || ""}
                                    onChange={(e) => setSelectedRole(e.target.value || null)}
                                >
                                    <option value="">All Roles</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="MODERATOR">Moderator</option>
                                    <option value="USER">User</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full py-2 px-3 border border-sky-100 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
                                    value={selectedStatus || ""}
                                    onChange={(e) => setSelectedStatus(e.target.value || null)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    className="px-4 py-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Users table */}
                <div className="bg-white rounded-xl shadow-sm border border-sky-100/50 overflow-hidden">
                    {selectedUsers.length > 0 && (
                        <div className="bg-sky-50 p-4 border-b border-sky-100/50 flex items-center justify-between">
                            <div className="text-sm text-sky-700">
                                <span className="font-medium">{selectedUsers.length}</span> users selected
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-sm text-sky-600 hover:text-sky-700 hover:bg-sky-100/50 rounded-lg transition-colors">
                                    <Mail size={16} className="inline mr-1" /> Email
                                </button>
                                <button className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 rounded-lg transition-colors">
                                    <UserX size={16} className="inline mr-1" /> Suspend
                                </button>
                            </div>
                        </div>
                    )}

                    {isUsersLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                            <span className="ml-2 text-gray-500">Loading users...</span>
                        </div>
                    ) : usersError ? (
                        <div className="p-8 text-center">
                            <div className="text-red-500 mb-2">Error loading users</div>
                            <div className="text-sm text-gray-500">{usersError}</div>
                            <button
                                className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                                onClick={() => {
                                    clearErrors()
                                    fetchUsers(currentPage, usersPerPage)
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-sky-100/50">
                                <thead className="bg-sky-50/50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                                checked={isSelectAll}
                                                onChange={toggleSelectAll}
                                            />
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <button
                                            className="flex items-center gap-1 hover:text-sky-600"
                                            onClick={() => handleSort("fullName")}
                                        >
                                            User
                                            {sortField === "fullName" &&
                                                (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                        </button>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <button className="flex items-center gap-1 hover:text-sky-600" onClick={() => handleSort("role")}>
                                            Role
                                            {sortField === "role" &&
                                                (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                        </button>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <button
                                            className="flex items-center gap-1 hover:text-sky-600"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            {sortField === "status" &&
                                                (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                        </button>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <button
                                            className="flex items-center gap-1 hover:text-sky-600"
                                            onClick={() => handleSort("joinedAt")}
                                        >
                                            Joined
                                            {sortField === "joinedAt" &&
                                                (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                        </button>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-sky-100/50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-sky-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleUserSelection(user.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={`/placeholder.svg?height=40&width=40&text=${user.fullName.charAt(0)}`}
                                                        alt={user.fullName}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.profile.joinedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative inline-block text-left">
                                                {selectedUsers.length === 0 && (
                                                    <ActionMenu
                                                        user={user}
                                                        onEdit={() => handleEditUser(user)}
                                                        onDelete={() => handleDeleteUser(user.id)}
                                                        onSuspendToggle={() => handleToggleSuspension(user)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!isUsersLoading && !usersError && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-sky-100/50">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1 || isProcessing}
                                    className="relative inline-flex items-center px-4 py-2 border border-sky-200 text-sm font-medium rounded-xl text-sky-700 bg-white hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || isProcessing}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-sky-200 text-sm font-medium rounded-xl text-sky-700 bg-white hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        {usersResponse && (
                                            <>
                                                Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{" "}
                                                <span className="font-medium">
                          {Math.min(currentPage * usersPerPage, usersResponse.totalElements)}
                        </span>{" "}
                                                of <span className="font-medium">{usersResponse.totalElements}</span> results
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1 || isProcessing}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-xl border border-sky-200 bg-white text-sm font-medium text-sky-500 hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronDown className="h-5 w-5 rotate-90" />
                                        </button>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={isProcessing}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        currentPage === pageNum
                                                            ? "z-10 bg-sky-50 border-sky-500 text-sky-600"
                                                            : "bg-white border-sky-200 text-gray-500 hover:bg-sky-50"
                                                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}

                                        <button
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages || isProcessing}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-xl border border-sky-200 bg-white text-sm font-medium text-sky-500 hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronDown className="h-5 w-5 -rotate-90" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {editingUser && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    userId={editingUser.id}
                    profile={editingUser.profile}
                />
            )}
        </div>
    )
}

// Action Menu Component
function ActionMenu({
                        user,
                        onEdit,
                        onDelete,
                        onSuspendToggle,
                    }: {
    user: User
    onEdit: () => void
    onDelete: () => void
    onSuspendToggle: () => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div ref={menuRef}>
            <button
                className="text-gray-400 hover:text-sky-600 transition-colors p-1 rounded-full hover:bg-sky-50"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User actions"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 transition-colors"
                            onClick={() => {
                                onEdit()
                                setIsOpen(false)
                            }}
                        >
                            <Edit size={16} className="mr-2 text-sky-500" />
                            Edit User
                        </button>
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 transition-colors"
                            onClick={() => {
                                // Email functionality
                                alert(`Send email to ${user.email}`)
                                setIsOpen(false)
                            }}
                        >
                            <Mail size={16} className="mr-2 text-sky-500" />
                            Send Email
                        </button>
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                            onClick={() => {
                                onSuspendToggle()
                                setIsOpen(false)
                            }}
                        >
                            <UserX size={16} className="mr-2" />
                            {user.status === "Suspended" ? "Unsuspend User" : "Suspend User"}
                        </button>
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                                onDelete()
                                setIsOpen(false)
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                            >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Delete User
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsersPage

