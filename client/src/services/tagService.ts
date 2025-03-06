// src/services/tagService.ts
import { apiInstance } from '../api';

export interface Tag {
    id: number;
    name: string;
    description?: string;
    count?: number; // How many questions use this tag
}

// Get all tags
export const getAllTags = async () => {
    try {
        const response = await apiInstance.get<Tag[]>('/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};

// Search tags by name
export const searchTags = async (query: string) => {
    try {
        const response = await apiInstance.get<Tag[]>('/tags/search', {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching tags:', error);
        throw error;
    }
};

// Get popular tags
export const getPopularTags = async (limit: number = 10) => {
    try {
        const response = await apiInstance.get<Tag[]>('/tags/popular', {
            params: { limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching popular tags:', error);
        // Return mock data as fallback if API isn't implemented yet
        return [
            { id: 1, name: 'java', count: 1254 },
            { id: 2, name: 'spring', count: 943 },
            { id: 3, name: 'react', count: 782 },
            { id: 4, name: 'javascript', count: 651 },
            { id: 5, name: 'typescript', count: 512 },
            { id: 6, name: 'sql', count: 487 },
            { id: 7, name: 'database', count: 423 },
            { id: 8, name: 'hibernate', count: 386 },
            { id: 9, name: 'jpa', count: 342 },
            { id: 10, name: 'spring-boot', count: 315 }
        ];
    }
};