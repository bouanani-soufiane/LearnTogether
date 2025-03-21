import { create } from 'zustand';
import { PagedResult } from '../types';
import {
    BlogResponseDTO,
    BlogSummaryDTO,
    CreateBlogRequest,
    UpdateBlogRequest,
    CreateCommentRequest,
    ReviewStatus
} from '../types/blogTypes';
import * as blogService from '../services/blogService';

interface BlogState {
    blogs: BlogSummaryDTO[];
    currentBlog: BlogResponseDTO | null;
    pagedResult: PagedResult<BlogSummaryDTO> | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAllBlogs: (page?: number, size?: number) => Promise<void>;
    fetchBlogById: (id: number) => Promise<void>;
    fetchMyBlogs: (page?: number, size?: number) => Promise<void>;
    fetchUserBlogs: (userId: number, page?: number, size?: number) => Promise<void>;
    createBlog: (blogData: CreateBlogRequest) => Promise<BlogResponseDTO>;
    updateBlog: (id: number, blogData: UpdateBlogRequest) => Promise<BlogResponseDTO>;
    deleteBlog: (id: number) => Promise<void>;
    likeBlog: (id: number) => Promise<void>;
    unlikeBlog: (id: number) => Promise<void>;
    reviewBlog: (id: number, status: ReviewStatus) => Promise<void>;
    addComment: (blogId: number, comment: CreateCommentRequest) => Promise<void>;
    deleteComment: (blogId: number, commentId: number) => Promise<void>;
    clearCurrentBlog: () => void;
    clearErrors: () => void;
}

export const useBlogStore = create<BlogState>()((set, get) => ({
    blogs: [],
    currentBlog: null,
    pagedResult: null,
    isLoading: false,
    error: null,

    fetchAllBlogs: async (page = 1, size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const result = await blogService.getAllBlogs(page, size);
            set({
                blogs: result.data,
                pagedResult: result,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch blogs',
                isLoading: false
            });
        }
    },

    fetchBlogById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const blog = await blogService.getBlogById(id);
            set({ currentBlog: blog, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || `Failed to fetch blog with ID ${id}`,
                isLoading: false
            });
        }
    },

    fetchMyBlogs: async (page = 1, size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const result = await blogService.getMyBlogs(page, size);
            set({
                blogs: result.data,
                pagedResult: result,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch your blogs',
                isLoading: false
            });
        }
    },

    fetchUserBlogs: async (userId, page = 1, size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const result = await blogService.getUserBlogs(userId, page, size);
            set({
                blogs: result.data,
                pagedResult: result,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.message || `Failed to fetch blogs for user ${userId}`,
                isLoading: false
            });
        }
    },

    createBlog: async (blogData) => {
        set({ isLoading: true, error: null });
        try {
            const newBlog = await blogService.createBlog(blogData);
            set((state) => ({
                blogs: [newBlog, ...state.blogs],
                isLoading: false
            }));
            return newBlog;
        } catch (error: any) {
            set({
                error: error.message || 'Failed to create blog',
                isLoading: false
            });
            throw error;
        }
    },

    updateBlog: async (id, blogData) => {
        set({ isLoading: true, error: null });
        try {
            const updatedBlog = await blogService.updateBlog(id, blogData);
            set((state) => ({
                blogs: state.blogs.map(blog => blog.id === id ? updatedBlog : blog),
                currentBlog: updatedBlog,
                isLoading: false
            }));
            return updatedBlog;
        } catch (error: any) {
            set({
                error: error.message || `Failed to update blog ${id}`,
                isLoading: false
            });
            throw error;
        }
    },

    deleteBlog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await blogService.deleteBlog(id);
            set((state) => ({
                blogs: state.blogs.filter(blog => blog.id !== id),
                currentBlog: state.currentBlog?.id === id ? null : state.currentBlog,
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || `Failed to delete blog ${id}`,
                isLoading: false
            });
            throw error;
        }
    },

    likeBlog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const updatedBlog = await blogService.likeBlog(id);
            set((state) => ({
                blogs: state.blogs.map(blog =>
                    blog.id === id ? { ...blog, likeCount: updatedBlog.likeCount } : blog
                ),
                currentBlog: state.currentBlog?.id === id
                    ? { ...updatedBlog, likedByCurrentUser: true }
                    : state.currentBlog,
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || `Failed to like blog ${id}`,
                isLoading: false
            });
        }
    },

    unlikeBlog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const updatedBlog = await blogService.unlikeBlog(id);
            set((state) => ({
                blogs: state.blogs.map(blog =>
                    blog.id === id ? { ...blog, likeCount: updatedBlog.likeCount } : blog
                ),
                currentBlog: state.currentBlog?.id === id
                    ? { ...updatedBlog, likedByCurrentUser: false }
                    : state.currentBlog,
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || `Failed to unlike blog ${id}`,
                isLoading: false
            });
        }
    },


    reviewBlog: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            const updatedBlog = await blogService.reviewBlog(id, status);
            set((state) => ({
                blogs: state.blogs.map(blog =>
                    blog.id === id ? { ...blog, reviewStatus: updatedBlog.reviewStatus } : blog
                ),
                currentBlog: state.currentBlog?.id === id ? updatedBlog : state.currentBlog,
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || `Failed to review blog ${id}`,
                isLoading: false
            });
        }
    },

    addComment: async (blogId, comment) => {
        set({ isLoading: true, error: null });
        try {
            const newComment = await blogService.addComment(blogId, comment);
            set((state) => {
                if (state.currentBlog && state.currentBlog.id === blogId) {
                    return {
                        currentBlog: {
                            ...state.currentBlog,
                            comments: [...state.currentBlog.comments, newComment],
                            commentCount: state.currentBlog.commentCount + 1
                        },
                        isLoading: false
                    };
                }
                return { isLoading: false };
            });
        } catch (error: any) {
            set({
                error: error.message || `Failed to add comment to blog ${blogId}`,
                isLoading: false
            });
        }
    },

    deleteComment: async (blogId, commentId) => {
        set({ isLoading: true, error: null });
        try {
            await blogService.deleteComment(blogId, commentId);
            set((state) => {
                if (state.currentBlog && state.currentBlog.id === blogId) {
                    return {
                        currentBlog: {
                            ...state.currentBlog,
                            comments: state.currentBlog.comments.filter(comment => comment.id !== commentId),
                            commentCount: state.currentBlog.commentCount - 1
                        },
                        isLoading: false
                    };
                }
                return { isLoading: false };
            });
        } catch (error: any) {
            set({
                error: error.message || `Failed to delete comment ${commentId}`,
                isLoading: false
            });
        }
    },

    clearCurrentBlog: () => {
        set({ currentBlog: null });
    },

    clearErrors: () => {
        set({ error: null });
    }
}));