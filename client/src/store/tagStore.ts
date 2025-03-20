// src/store/tagStore.ts
import { create } from 'zustand';
import {
    getAllTags,
    getTagById,
    searchTags,
    createTag as createTagService,
    Tag
} from '../services/tagService';

interface TagState {
    tags: Tag[];
    isLoading: boolean;
    error: string | null;

    // User preferences for tags
    watchedTags: Set<number>;
    ignoredTags: Set<number>;

    // Actions
    fetchTags: () => Promise<void>;
    fetchTagById: (id: number) => Promise<Tag | undefined>;
    searchTags: (query: string, limit?: number) => Promise<Tag[]>;
    createTag: (name: string) => Promise<Tag | undefined>;

    // UI state management
    clearError: () => void;
    setLoading: (loading: boolean) => void;

    // User preference actions
    watchTag: (tagId: number) => void;
    ignoreTag: (tagId: number) => void;
    resetTagPreference: (tagId: number) => void;
}

export const useTagStore = create<TagState>((set, get) => ({
    tags: [],
    isLoading: false,
    error: null,

    watchedTags: new Set<number>(),
    ignoredTags: new Set<number>(),

    // Action to set loading state
    setLoading: (loading: boolean) => set({ isLoading: loading }),

    // Action to clear error
    clearError: () => set({ error: null }),

    fetchTags: async () => {
        set({ isLoading: true, error: null });
        try {
            const tags = await getAllTags();

            // Since the backend doesn't provide count, description, etc.,
            // we'll generate placeholder data
            const enhancedTags = tags.map(tag => ({
                ...tag,
                count: Math.floor(Math.random() * 100000),
                description: `Tag for ${tag.name} related questions and discussions.`,
                createdAt: new Date().toISOString(),
                isWatched: get().watchedTags.has(tag.id),
                isIgnored: get().ignoredTags.has(tag.id)
            }));

            set({ tags: enhancedTags, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch tags', isLoading: false });
        }
    },

    fetchTagById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const tag = await getTagById(id);
            set({ isLoading: false });
            return tag;
        } catch (error: any) {
            set({
                error: error.message || `Failed to fetch tag with ID ${id}`,
                isLoading: false
            });
            return undefined;
        }
    },

    searchTags: async (query: string, limit?: number) => {
        set({ isLoading: true, error: null });
        try {
            const tags = await searchTags(query, limit);
            set({ isLoading: false });
            return tags;
        } catch (error: any) {
            set({
                error: error.message || 'Failed to search tags',
                isLoading: false
            });
            return [];
        }
    },

    createTag: async (name: string) => {
        set({ isLoading: true, error: null });
        try {
            const tag = await createTagService(name);

            // Add the new tag to the store
            set(state => ({
                tags: [...state.tags, {
                    ...tag,
                    count: 0,
                    description: `Tag for ${tag.name} related questions and discussions.`,
                    createdAt: new Date().toISOString(),
                    isWatched: false,
                    isIgnored: false
                }],
                isLoading: false
            }));

            return tag;
        } catch (error: any) {
            // Handle different types of errors from the API
            let errorMessage = 'Failed to create tag';

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 400) {
                    errorMessage = 'Invalid tag name. Please try again.';
                } else if (error.response.status === 401) {
                    errorMessage = 'You must be logged in to create tags.';
                } else if (error.response.status === 403) {
                    errorMessage = 'You do not have permission to create tags.';
                } else if (error.response.status === 409) {
                    errorMessage = 'A tag with this name already exists.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            set({ error: errorMessage, isLoading: false });
            return undefined;
        }
    },

    watchTag: (tagId: number) => {
        const { watchedTags, ignoredTags } = get();
        const newWatchedTags = new Set(watchedTags);
        const newIgnoredTags = new Set(ignoredTags);

        // Add to watched tags
        newWatchedTags.add(tagId);
        // Remove from ignored tags if present
        newIgnoredTags.delete(tagId);

        // Update tags to reflect the watch status
        set(state => ({
            watchedTags: newWatchedTags,
            ignoredTags: newIgnoredTags,
            tags: state.tags.map(tag =>
                tag.id === tagId
                    ? { ...tag, isWatched: true, isIgnored: false }
                    : tag
            )
        }));
    },

    ignoreTag: (tagId: number) => {
        const { watchedTags, ignoredTags } = get();
        const newWatchedTags = new Set(watchedTags);
        const newIgnoredTags = new Set(ignoredTags);

        // Add to ignored tags
        newIgnoredTags.add(tagId);
        // Remove from watched tags if present
        newWatchedTags.delete(tagId);

        // Update tags to reflect the ignore status
        set(state => ({
            watchedTags: newWatchedTags,
            ignoredTags: newIgnoredTags,
            tags: state.tags.map(tag =>
                tag.id === tagId
                    ? { ...tag, isWatched: false, isIgnored: true }
                    : tag
            )
        }));
    },

    resetTagPreference: (tagId: number) => {
        const { watchedTags, ignoredTags } = get();
        const newWatchedTags = new Set(watchedTags);
        const newIgnoredTags = new Set(ignoredTags);

        // Remove from both sets
        newWatchedTags.delete(tagId);
        newIgnoredTags.delete(tagId);

        // Update tags to reflect the reset status
        set(state => ({
            watchedTags: newWatchedTags,
            ignoredTags: newIgnoredTags,
            tags: state.tags.map(tag =>
                tag.id === tagId
                    ? { ...tag, isWatched: false, isIgnored: false }
                    : tag
            )
        }));
    }
}));