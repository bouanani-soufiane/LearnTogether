import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiInstance } from '../api';
import { API } from '../api/endpoints';
import { UserRole } from '../types';

interface User {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
    token?: string;
}

interface AuthState {
    user: User | null;
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
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiInstance.post(API.login, { email, password });

                    const { token, user } = response.data;

                    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    set({
                        user,
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
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);