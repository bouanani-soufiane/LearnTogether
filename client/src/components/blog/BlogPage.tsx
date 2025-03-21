import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '../../store/blogStore';
import { useAuthStore } from '../../store/authStore';
import BlogCard from '../../components/blog/BlogCard';
import { Plus, Filter, RefreshCw } from 'lucide-react';
import { UserRole } from '../../types';

const BlogPage: React.FC = () => {
    const { blogs, pagedResult, isLoading, error, fetchAllBlogs } = useBlogStore();
    const { isAuthenticated, user } = useAuthStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const isTeacher = user?.role === UserRole.TEACHER;
    const isAdmin = user?.role === UserRole.ADMIN;
    const canCreateBlog = isAuthenticated;

    useEffect(() => {
        fetchAllBlogs(currentPage, pageSize);
    }, [fetchAllBlogs, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading && blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
                    <p className="text-gray-600 mt-1">
                        Explore articles, tutorials, and insights from the community
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => fetchAllBlogs(currentPage, pageSize)}
                        className="p-2 rounded-lg hover:bg-sky-50 text-gray-600 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>

                    {canCreateBlog && (
                        <Link
                            to="/blog/new"
                            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all duration-200"
                        >
                            <Plus size={18} className="mr-1" />
                            New Post
                        </Link>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map(blog => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>

            {blogs.length === 0 && !isLoading && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-medium text-gray-700">No blog posts yet</h3>
                    <p className="text-gray-500 mt-2">Be the first to share your knowledge with the community!</p>

                    {canCreateBlog && (
                        <Link
                            to="/blog/new"
                            className="inline-block mt-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
                        >
                            <Plus size={18} className="mr-1 inline-block" />
                            Write a Post
                        </Link>
                    )}
                </div>
            )}

            {pagedResult && pagedResult.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <nav className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagedResult.hasPrevious}
                            className={`px-3 py-1 rounded-md ${
                                pagedResult.hasPrevious
                                    ? 'bg-white hover:bg-sky-50 text-sky-600 border border-sky-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            }`}
                        >
                            Previous
                        </button>

                        {[...Array(pagedResult.totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === index + 1
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-white hover:bg-sky-50 text-sky-600 border border-sky-200'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagedResult.hasNext}
                            className={`px-3 py-1 rounded-md ${
                                pagedResult.hasNext
                                    ? 'bg-white hover:bg-sky-50 text-sky-600 border border-sky-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default BlogPage;