// src/services/tagService.ts
import { apiInstance } from '../api';

export interface Tag {
    id: number;
    name: string;
    description?: string;
    count?: number;
    isWatched?: boolean;
    isIgnored?: boolean;
    createdAt?: string;
}

/**
 * Fetches all tags from the API
 */
export const getAllTags = async (): Promise<Tag[]> => {
    try {
        const response = await apiInstance.get('/api/v1/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};

/**
 * Fetches a specific tag by its ID
 */
export const getTagById = async (id: number): Promise<Tag> => {
    try {
        const response = await apiInstance.get(`/api/v1/tags/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tag with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Searches for tags matching the provided query
 */
export const searchTags = async (query: string, limit: number = 10): Promise<Tag[]> => {
    try {
        const response = await apiInstance.get('/api/v1/tags/search', {
            params: { query, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching tags:', error);
        throw error;
    }
};

/**
 * Creates a new tag
 */
export const createTag = async (name: string): Promise<Tag> => {
    try {
        const response = await apiInstance.post('/api/v1/tags', { name });
        return response.data;
    } catch (error) {
        console.error('Error creating tag:', error);
        throw error;
    }
};

/**
 * Updates an existing tag
 */
export const updateTag = async (id: number, name: string): Promise<Tag> => {
    try {
        const response = await apiInstance.put(`/api/v1/tags/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error(`Error updating tag with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Deletes a tag
 */
export const deleteTag = async (id: number): Promise<void> => {
    try {
        await apiInstance.delete(`/api/v1/tags/${id}`);
    } catch (error) {
        console.error(`Error deleting tag with ID ${id}:`, error);
        throw error;
    }
};

/**
 * Gets tags associated with a specific blog post
 */
export const getTagsByBlogId = async (blogId: number): Promise<Tag[]> => {
    try {
        const response = await apiInstance.get(`/api/v1/tags/blog/${blogId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tags for blog ${blogId}:`, error);
        throw error;
    }
};

/**
 * Gets tags associated with a specific question
 */
export const getTagsByQuestionId = async (questionId: number): Promise<Tag[]> => {
    try {
        const response = await apiInstance.get(`/api/v1/tags/question/${questionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tags for question ${questionId}:`, error);
        throw error;
    }
};