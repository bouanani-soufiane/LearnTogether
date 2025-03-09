// src/services/profileService.ts
import { apiInstance } from '../api';
import {ProfileData, UserProfile, UserStats} from '../types/userTypes';

export const fetchUserProfile = async (userId: number): Promise<ProfileData> => {
    try {
        const response = await apiInstance.get(`/api/v1/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const fetchUserStats = async (userId: number): Promise<UserStats> => {
    try {
        const response = await apiInstance.get(`/api/v1/users/${userId}/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        // Return mock data as fallback if API isn't implemented yet
        return {
            questions: Math.floor(Math.random() * 50),
            answers: Math.floor(Math.random() * 200),
            reached: `~${Math.floor(Math.random() * 1000)}k`,
            badges: {
                gold: Math.floor(Math.random() * 5),
                silver: Math.floor(Math.random() * 30),
                bronze: Math.floor(Math.random() * 100)
            }
        };
    }
};

export const updateUserProfile = async (userId: number, profileData: Partial<UserProfile>): Promise<ProfileData> => {
    try {
        const response = await apiInstance.put(`/api/v1/users/${userId}/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};