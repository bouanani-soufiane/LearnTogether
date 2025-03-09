// src/store/userStore.ts
import { create } from 'zustand';
import { getUsers, getUserById, updateUser, updateUserProfile, deleteUser, User, UsersResponse } from '../services/userService';

interface UserState {
    users: User[];
    usersResponse: UsersResponse | null;
    isUsersLoading: boolean;
    usersError: string | null;

    currentUser: User | null;
    isUserLoading: boolean;
    userError: string | null;

    isProcessing: boolean;
    processError: string | null;

    fetchUsers: (page?: number, size?: number) => Promise<void>;
    fetchUserById: (id: number) => Promise<void>;
    updateUser: (id: number, userData: { fullName: string; email: string; password?: string }) => Promise<void>;
    updateUserProfile: (userId: number, profileData: {
        bio: string | null;
        location: string | null;
        websiteLink: string | null;
        birthdate: string | null;
    }) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    clearErrors: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    usersResponse: null,
    isUsersLoading: false,
    usersError: null,

    currentUser: null,
    isUserLoading: false,
    userError: null,

    isProcessing: false,
    processError: null,

    fetchUsers: async (page = 1, size = 10) => {
        set({ isUsersLoading: true, usersError: null });
        try {
            const response = await getUsers(page, size);
            set({
                users: response.data,
                usersResponse: response,
                isUsersLoading: false
            });
        } catch (error: any) {
            set({
                usersError: error.message || 'Failed to fetch users',
                isUsersLoading: false
            });
        }
    },

    fetchUserById: async (id: number) => {
        set({ isUserLoading: true, userError: null });
        try {
            const user = await getUserById(id);
            set({
                currentUser: user,
                isUserLoading: false
            });
        } catch (error: any) {
            set({
                userError: error.message || `Failed to fetch user with ID ${id}`,
                isUserLoading: false
            });
        }
    },

    updateUser: async (id: number, userData) => {
        set({ isProcessing: true, processError: null });
        try {
            const updatedUser = await updateUser(id, userData);

            // Update the users list if this user is in it
            const users = get().users;
            const updatedUsers = users.map(user =>
                user.id === id ? updatedUser : user
            );

            // Update current user if it's the same ID
            const currentUser = get().currentUser;

            set({
                users: updatedUsers,
                currentUser: currentUser?.id === id ? updatedUser : currentUser,
                isProcessing: false
            });
        } catch (error: any) {
            set({
                processError: error.message || `Failed to update user ${id}`,
                isProcessing: false
            });
        }
    },

    updateUserProfile: async (userId: number, profileData) => {
        set({ isProcessing: true, processError: null });
        try {
            const updatedUser = await updateUserProfile(userId, profileData);

            // Update the users list if this user is in it
            const users = get().users;
            const updatedUsers = users.map(user =>
                user.id === userId ? updatedUser : user
            );

            // Update current user if it's the same ID
            const currentUser = get().currentUser;

            set({
                users: updatedUsers,
                currentUser: currentUser?.id === userId ? updatedUser : currentUser,
                isProcessing: false
            });
        } catch (error: any) {
            set({
                processError: error.message || `Failed to update profile for user ${userId}`,
                isProcessing: false
            });
        }
    },

    deleteUser: async (id: number) => {
        set({ isProcessing: true, processError: null });
        try {
            await deleteUser(id);

            // Remove user from the users list
            const users = get().users.filter(user => user.id !== id);

            // Clear current user if it's the same ID
            const currentUser = get().currentUser;

            set({
                users,
                currentUser: currentUser?.id === id ? null : currentUser,
                isProcessing: false
            });
        } catch (error: any) {
            set({
                processError: error.message || `Failed to delete user ${id}`,
                isProcessing: false
            });
        }
    },

    clearErrors: () => {
        set({
            usersError: null,
            userError: null,
            processError: null
        });
    }
}));