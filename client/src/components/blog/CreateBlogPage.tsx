import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogStore } from '../../store/blogStore';
import { useTagStore } from '../../store/tagStore';
import { useAuthStore } from '../../store/authStore';
import { X } from 'lucide-react';

const CreateBlogPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [errors, setErrors] = useState<{title?: string; content?: string; tags?: string}>({});

    const navigate = useNavigate();
    const { createBlog, isLoading, error } = useBlogStore();
    const { tags, fetchTags } = useTagStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }

        fetchTags();
    }, [isAuthenticated, navigate, fetchTags]);

    const validateForm = () => {
        const newErrors: {title?: string; content?: string; tags?: string} = {};
        let isValid = true;

        if (!title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        } else if (title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
            isValid = false;
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
            isValid = false;
        } else if (content.trim().length < 20) {
            newErrors.content = 'Content must be at least 20 characters';
            isValid = false;
        }

        if (selectedTags.length === 0) {
            newErrors.tags = 'Select at least one tag';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const newBlog = await createBlog({
                title: title.trim(),
                content: content.trim(),
                tagIds: selectedTags
            });

            navigate(`/blog/${newBlog.id}`);
        } catch (err) {
            console.error('Error creating blog:', err);
        }
    };

    const handleTagToggle = (tagId: number) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Blog Post</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-4 py-2 border ${
                            errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-sky-500'
                        } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                        placeholder="Enter a descriptive title"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                    </label>
                    <div className="mb-2">
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                        selectedTags.includes(tag.id)
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {errors.tags && (
                        <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={`w-full px-4 py-2 border ${
                            errors.content ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-sky-500'
                        } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                        placeholder="Write your blog post content here..."
                        rows={12}
                    ></textarea>
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/blog')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg shadow-sm hover:from-sky-600 hover:to-sky-700 transition-colors ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlogPage;