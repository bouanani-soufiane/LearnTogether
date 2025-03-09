// src/store/profileStore.ts
import { create } from 'zustand';
import { fetchUserProfile, fetchUserStats, updateUserProfile } from '../services/profileService';
import { ProfileData, UserProfile, UserStats } from '../types/userTypes';

interface ProfileState {
    currentProfile: ProfileData | null;
    profileStats: UserStats | null;
    isProfileLoading: boolean;
    profileError: string | null;

    fetchProfileById: (userId: number) => Promise<void>;
    updateProfile: (userId: number, profileData: Partial<UserProfile>) => Promise<void>;
    clearProfileState: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    currentProfile: null,
    profileStats: null,
    isProfileLoading: false,
    profileError: null,

    fetchProfileById: async (userId: number) => {
        set({ isProfileLoading: true, profileError: null });
        try {
            const profileData = await fetchUserProfile(userId);
            const statsData = await fetchUserStats(userId);

            set({
                currentProfile: profileData,
                profileStats: statsData,
                isProfileLoading: false
            });
        } catch (error: any) {
            set({
                profileError: error.message || 'Failed to fetch user profile',
                isProfileLoading: false
            });
        }
    },

    updateProfile: async (userId: number, profileData: Partial<UserProfile>) => {
        set({ isProfileLoading: true, profileError: null });
        try {
            const updatedProfile = await updateUserProfile(userId, profileData);

            set({
                currentProfile: updatedProfile,
                isProfileLoading: false
            });
        } catch (error: any) {
            set({
                profileError: error.message || 'Failed to update user profile',
                isProfileLoading: false
            });
        }
    },

    clearProfileState: () => {
        set({
            currentProfile: null,
            profileStats: null,
            profileError: null
        });
    }
}));