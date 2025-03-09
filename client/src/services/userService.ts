// src/services/userService.ts
import { apiInstance } from '../api';

export interface User {
    id: number;
    fullName: string;
    email: string;
    status: string;
    role: string;
    profile: {
        userId: number;
        bio: string | null;
        location: string | null;
        websiteLink: string | null;
        birthdate: string | null;
        joinedAt: string;
    };
}

export interface PagedResult<T> {
    data: T[];
    totalElements: number;
    pageNumber: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export type UsersResponse = PagedResult<User>;

export const getUsers = async (page = 1, size = 10): Promise<UsersResponse> => {
    try {
        const response = await apiInstance.get('/api/v1/users', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (id: number): Promise<User> => {
    try {
        const response = await apiInstance.get<User>(`/api/v1/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

export const updateUser = async (id: number, userData: { fullName: string; email: string; password?: string }): Promise<User> => {
    try {
        const response = await apiInstance.put<User>(`/api/v1/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
};

export const updateUserProfile = async (userId: number, profileData: {
    bio: string | null;
    location: string | null;
    websiteLink: string | null;
    birthdate: string | null;
}): Promise<User> => {
    try {
        const response = await apiInstance.put<User>(`/api/v1/users/${userId}/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error(`Error updating profile for user ${userId}:`, error);
        throw error;
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        await apiInstance.delete(`/api/v1/users/${id}`);
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
};