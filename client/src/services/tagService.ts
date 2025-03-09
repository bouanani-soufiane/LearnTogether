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

export const getAllTags = async (): Promise<Tag[]> => {
    try {
        const response = await apiInstance.get<Tag[]>('/api/v1/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};

export const getTagById = async (id: number): Promise<Tag> => {
    try {
        const response = await apiInstance.get<Tag>(`/api/v1/tags/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tag with ID ${id}:`, error);
        throw error;
    }
};

export const searchTags = async (query: string, limit: number = 10): Promise<Tag[]> => {
    try {
        const response = await apiInstance.get<Tag[]>('/api/v1/tags/search', {
            params: { query, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching tags:', error);
        throw error;
    }
};

export const createTag = async (name: string): Promise<Tag> => {
    try {
        const response = await apiInstance.post<Tag>('/api/v1/tags', { name });
        return response.data;
    } catch (error) {
        console.error('Error creating tag:', error);
        throw error;
    }
};