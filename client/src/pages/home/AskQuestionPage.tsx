import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import LexicalEditor from '../../components/LexicalEditor';
import MarkdownTips from '../../components/MarkdownTips';
import { FaPaperPlane, FaTimes, FaMarkdown, FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { useQuestionStore } from '../../store/questionStore';
import { useTagStore } from '../../store/tagStore';
import { Tag } from '../../services/tagService';
import { useToast } from '../../hooks/use-toast';

const AskQuestionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { isAuthenticated } = useAuthStore();
    const { submitQuestion, isSubmittingQuestion, createQuestionError } = useQuestionStore();
    const {
        tags,
        fetchTags,
        searchTags,
        createTag,
        isLoading: isTagLoading,
        error: tagError
    } = useTagStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [titleError, setTitleError] = useState<string | null>(null);
    const [contentError, setContentError] = useState<string | null>(null);
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [isSearchingTags, setIsSearchingTags] = useState(false);
    const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);

    const tagInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Handle authentication check
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/questions/ask' } });
        }
    }, [isAuthenticated, navigate]);

    // Fetch tags on component mount
    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    // Handle URL query parameters for pre-filled tags
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tagParam = queryParams.get('tags');

        if (tagParam) {
            const tagNames = tagParam.split(',').map(t => t.trim());
            const matchedTags = tags.filter(tag => tagNames.includes(tag.name));
            if (matchedTags.length > 0) {
                setSelectedTags(matchedTags);
            }
        }
    }, [location.search, tags]);

    // Handle tag search
    useEffect(() => {
        const searchTagsAsync = async () => {
            if (tagInput.trim().length < 1) {
                setTagSuggestions([]);
                setIsSearchingTags(false);
                return;
            }

            setIsSearchingTags(true);
            try {
                const searchResults = await searchTags(tagInput.trim(), 10);
                // Filter out tags that are already selected
                const filteredResults = searchResults.filter(
                    tag => !selectedTags.some(selectedTag => selectedTag.id === tag.id)
                );
                setTagSuggestions(filteredResults);
            } catch (error) {
                console.error('Error searching tags:', error);
                // In case of error, fall back to local filtering
                const filtered = tags.filter(
                    tag =>
                        tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                        !selectedTags.some(selectedTag => selectedTag.id === tag.id)
                );
                setTagSuggestions(filtered);
            } finally {
                setIsSearchingTags(false);
            }
        };

        // Use a debounce to avoid too many API calls
        const timeoutId = setTimeout(searchTagsAsync, 300);
        return () => clearTimeout(timeoutId);
    }, [tagInput, tags, selectedTags, searchTags]);

    // Handle click outside suggestions to close them
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                tagInputRef.current &&
                !tagInputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
        setShowSuggestions(true);
    };

    const addTag = (tag: Tag) => {
        if (!selectedTags.some(t => t.id === tag.id)) {
            if (selectedTags.length < 5) {
                setSelectedTags([...selectedTags, tag]);
                setTagInput('');
                setShowSuggestions(false);

                // Focus the input again after adding a tag
                if (tagInputRef.current) {
                    tagInputRef.current.focus();
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Tag limit reached",
                    description: "You can only add up to 5 tags per question.",
                });
            }
        }
    };

    const removeTag = (id: number) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== id));
    };

    const handleCreateNewTag = async () => {
        if (tagInput.trim().length < 2) {
            toast({
                variant: "destructive",
                title: "Invalid tag name",
                description: "Tag name must be at least 2 characters long.",
            });
            return;
        }

        setIsCreateTagModalOpen(true);
    };

    const handleTagCreated = (newTag: Tag) => {
        // Add the newly created tag to selected tags
        addTag(newTag);
        setIsCreateTagModalOpen(false);
    };

    const validateForm = () => {
        let isValid = true;

        if (title.trim().length < 5) {
            setTitleError('Title must be at least 5 characters');
            isValid = false;
        } else {
            setTitleError(null);
        }

        const stripHtmlTags = (html: string) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.textContent?.trim() || '';
        };

        const plainTextContent = stripHtmlTags(content);
        if (plainTextContent.length < 10) {
            setContentError('Content must be at least 10 characters');
            isValid = false;
        } else {
            setContentError(null);
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (selectedTags.length === 0) {
            toast({
                variant: "destructive",
                title: "Tags required",
                description: "Please add at least one tag to your question.",
            });
            return;
        }

        const questionData = {
            title,
            content,
            tagIds: selectedTags.map(tag => tag.id)
        };

        const newQuestionId = await submitQuestion(questionData);

        if (newQuestionId) {
            toast({
                variant: "success",
                title: "Question posted successfully",
                description: "Your question has been submitted."
            });
            navigate(`/questions/${newQuestionId}`);
        }
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 ml-0 md:ml-[200px]">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
                        <p className="mt-2 text-gray-600">
                            Get help from the community by asking a clear, specific question
                        </p>
                    </div>

                    {createQuestionError && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                            <p className="font-medium">Error</p>
                            <p>{createQuestionError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <p className="text-sm text-gray-500 mb-2">
                                    Be specific and imagine you're asking a question to another person
                                </p>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. How to implement many-to-many relationships in Spring Data JDBC?"
                                    className={`w-full px-3 py-2 border ${titleError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {titleError && (
                                    <p className="mt-1 text-sm text-red-600">{titleError}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <p className="text-sm text-gray-500 mb-2">
                                    Include all the information someone would need to answer your question
                                </p>

                                <MarkdownTips />

                                <div className="mb-2">
                                    <LexicalEditor
                                        onChange={setContent}
                                        placeholder="Write your question details here... Be specific and provide examples."
                                        minHeight="300px"
                                    />
                                </div>

                                {contentError && (
                                    <p className="mt-1 text-sm text-red-600">{contentError}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <p className="text-sm text-gray-500 mb-2">
                                    Add up to 5 tags to describe what your question is about
                                </p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedTags.map(tag => (
                                        <div
                                            key={tag.id}
                                            className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                                        >
                                            <span>{tag.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag.id)}
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="relative">
                                    <div className="flex mb-2">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                {isSearchingTags ? (
                                                    <FaSpinner className="animate-spin text-gray-400" />
                                                ) : (
                                                    <FaSearch className="text-gray-400" />
                                                )}
                                            </div>
                                            <input
                                                ref={tagInputRef}
                                                type="text"
                                                id="tags"
                                                value={tagInput}
                                                onChange={handleTagInputChange}
                                                placeholder="Search for tags or type to create new"
                                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                onFocus={() => setShowSuggestions(true)}
                                            />
                                        </div>
                                        {tagInput.trim().length >= 2 && (
                                            <button
                                                type="button"
                                                onClick={handleCreateNewTag}
                                                className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                                            >
                                                <FaPlus className="mr-1" />
                                                Create
                                            </button>
                                        )}
                                    </div>

                                    {showSuggestions && (
                                        <div
                                            ref={suggestionsRef}
                                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto border border-gray-200"
                                        >
                                            {isSearchingTags && (
                                                <div className="px-4 py-3 text-gray-500 flex items-center">
                                                    <FaSpinner className="animate-spin mr-2" />
                                                    Searching tags...
                                                </div>
                                            )}

                                            {!isSearchingTags && tagSuggestions.length === 0 && tagInput.trim() !== '' && (
                                                <div className="px-4 py-3 text-gray-500">
                                                    No matching tags found. You can create a new tag.
                                                </div>
                                            )}

                                            {!isSearchingTags && tagSuggestions.length === 0 && tagInput.trim() === '' && (
                                                <div className="px-4 py-3 text-gray-500">
                                                    Type to search for tags
                                                </div>
                                            )}

                                            {tagSuggestions.map(tag => (
                                                <div
                                                    key={tag.id}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                                    onClick={() => addTag(tag)}
                                                >
                                                    <div className="flex items-center">
                                                        <span className="font-medium">{tag.name}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {tag.count || 0} questions
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 text-sm text-gray-500">
                                    Popular tags:
                                    {tags.slice(0, 5).map((tag, index) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => addTag(tag)}
                                            className="mx-1 text-blue-600 hover:text-blue-800"
                                            disabled={selectedTags.some(t => t.id === tag.id)}
                                        >
                                            {tag.name}{index < 4 ? ',' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmittingQuestion}
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmittingQuestion ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="mr-2" />
                                        Post Your Question
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default AskQuestionPage;