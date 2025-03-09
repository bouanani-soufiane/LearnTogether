// src/store/tagStore.ts
import { create } from 'zustand';
import { getAllTags, getTagById, searchTags, createTag, Tag } from '../services/tagService';

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
        try {
            const tag = await getTagById(id);
            return tag;
        } catch (error) {
            console.error(`Error fetching tag ${id}:`, error);
            return undefined;
        }
    },

    searchTags: async (query: string, limit?: number) => {
        try {
            const tags = await searchTags(query, limit);
            return tags;
        } catch (error) {
            console.error('Error searching tags:', error);
            return [];
        }
    },

    createTag: async (name: string) => {
        try {
            const tag = await createTag(name);
            // Add the new tag to the store
            set(state => ({
                tags: [...state.tags, {
                    ...tag,
                    count: 0,
                    description: `Tag for ${tag.name} related questions and discussions.`,
                    createdAt: new Date().toISOString(),
                    isWatched: false,
                    isIgnored: false
                }]
            }));
            return tag;
        } catch (error) {
            console.error('Error creating tag:', error);
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