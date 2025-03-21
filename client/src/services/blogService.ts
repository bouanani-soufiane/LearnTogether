import { apiInstance } from '../api';
import { PagedResult } from '../types';
import {
    BlogResponseDTO,
    BlogSummaryDTO,
    CreateBlogRequest,
    UpdateBlogRequest,
    CreateCommentRequest,
    CommentResponseDTO,
    ReviewStatus
} from '../types/blogTypes';

const BASE_URL = '/api/v1/blogs';

export const getAllBlogs = async (page = 1, size = 10): Promise<PagedResult<BlogSummaryDTO>> => {
    try {
        const response = await apiInstance.get(BASE_URL, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
};

export const getBlogById = async (id: number): Promise<BlogResponseDTO> => {
    try {
        const response = await apiInstance.get<BlogResponseDTO>(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog with ID ${id}:`, error);
        throw error;
    }
};

export const createBlog = async (blogData: CreateBlogRequest): Promise<BlogResponseDTO> => {
    try {
        const response = await apiInstance.post<BlogResponseDTO>(BASE_URL, blogData);
        return response.data;
    } catch (error) {
        console.error('Error creating blog:', error);
        throw error;
    }
};

export const updateBlog = async (id: number, blogData: UpdateBlogRequest): Promise<BlogResponseDTO> => {
    try {
        const response = await apiInstance.put<BlogResponseDTO>(`${BASE_URL}/${id}`, blogData);
        return response.data;
    } catch (error) {
        console.error(`Error updating blog ${id}:`, error);
        throw error;
    }
};

export const deleteBlog = async (id: number): Promise<void> => {
    try {
        await apiInstance.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting blog ${id}:`, error);
        throw error;
    }
};

export const likeBlog = async (id: number): Promise<BlogResponseDTO> => {
    try {
        const response = await apiInstance.post<BlogResponseDTO>(`${BASE_URL}/${id}/likes`);
        return response.data;
    } catch (error) {
        console.error(`Error liking blog ${id}:`, error);
        throw error;
    }
};

export const unlikeBlog = async (id: number): Promise<BlogResponseDTO> => {
    try {
        const response = await apiInstance.delete<BlogResponseDTO>(`${BASE_URL}/${id}/likes`);
        return response.data;
    } catch (error) {
        console.error(`Error unliking blog ${id}:`, error);
        throw error;
    }
};

export const reviewBlog = async (id: number, status: ReviewStatus): Promise<BlogResponseDTO> => {
    try {
        const response = await apiInstance.put<BlogResponseDTO>(`${BASE_URL}/${id}/review`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error reviewing blog ${id}:`, error);
        throw error;
    }
};

export const addComment = async (blogId: number, comment: CreateCommentRequest): Promise<CommentResponseDTO> => {
    try {
        const response = await apiInstance.post<CommentResponseDTO>(`${BASE_URL}/${blogId}/comments`, comment);
        return response.data;
    } catch (error) {
        console.error(`Error adding comment to blog ${blogId}:`, error);
        throw error;
    }
};

export const deleteComment = async (blogId: number, commentId: number): Promise<void> => {
    try {
        await apiInstance.delete(`${BASE_URL}/${blogId}/comments/${commentId}`);
    } catch (error) {
        console.error(`Error deleting comment ${commentId} from blog ${blogId}:`, error);
        throw error;
    }
};

export const getUserBlogs = async (userId: number, page = 1, size = 10): Promise<PagedResult<BlogSummaryDTO>> => {
    try {
        const response = await apiInstance.get(`${BASE_URL}/user/${userId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching blogs for user ${userId}:`, error);
        throw error;
    }
};

export const getMyBlogs = async (page = 1, size = 10): Promise<PagedResult<BlogSummaryDTO>> => {
    try {
        const response = await apiInstance.get(`${BASE_URL}/my-blogs`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching my blogs:', error);
        throw error;
    }
};