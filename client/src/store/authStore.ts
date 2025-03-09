import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiInstance } from '../api';
import { API } from '../api/endpoints';
import { UserRole, UserStatus } from '../types';

// Inner profile structure
interface UserProfile {
    userId: number;
    bio: string | null;
    location: string | null;
    websiteLink: string | null;
    birthdate: string | null;
    joinedAt: string;
}

// Complete user object
interface UserDetails {
    id: number;
    fullName: string;
    email: string;
    status: UserStatus;
    role: UserRole;
    profile: UserProfile;
}

// Main user for our app
interface User {
    id: number;
    email: string;
    fullName: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    userDetails: UserDetails | null; // Store the complete user details
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            userDetails: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiInstance.post(API.login, { email, password });
                    console.log("Login response:", response.data);

                    // Extract data from response
                    const { token, id, email: userEmail, role, profile } = response.data;

                    // Store the full user details
                    const userDetails: UserDetails = profile;

                    // Convert role from "ROLE_ADMIN" format to "ADMIN" if needed
                    const userRole = role.startsWith("ROLE_")
                        ? role.substring(5) as UserRole
                        : role as UserRole;

                    // Create simplified user object for components
                    const user: User = {
                        id: Number(id),
                        email: userEmail,
                        fullName: profile.fullName,
                        role: userRole
                    };

                    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    set({
                        user,
                        userDetails,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    let errorMessage = 'Login failed. Please check your credentials.';

                    if (error.response) {
                        if (error.response.data?.message) {
                            errorMessage = error.response.data.message;
                        }
                    } else if (error.request) {
                        errorMessage = 'No response from server. Please check your connection.';
                    }

                    set({
                        isLoading: false,
                        error: errorMessage,
                        user: null,
                        userDetails: null,
                        token: null,
                        isAuthenticated: false
                    });
                }
            },

            logout: async () => {
                set({ isLoading: true });

                try {
                    await apiInstance.post(API.logout);
                } catch (error) {
                    console.error('Logout error:', error);
                }

                delete apiInstance.defaults.headers.common['Authorization'];

                set({
                    user: null,
                    userDetails: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                userDetails: state.userDetails,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);