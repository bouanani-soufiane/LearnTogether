import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import LexicalEditor from '../../components/LexicalEditor';
import MarkdownTips from '../../components/MarkdownTips';
import { FaPaperPlane, FaTimes, FaMarkdown } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { useQuestionStore } from '../../store/questionStore';

interface TagSuggestion {
    id: number;
    name: string;
}

const AskQuestionPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { submitQuestion, isSubmittingQuestion, createQuestionError } = useQuestionStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<TagSuggestion[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [titleError, setTitleError] = useState<string | null>(null);
    const [contentError, setContentError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/questions/ask' } });
        }
    }, [isAuthenticated, navigate]);

    const mockTagSuggestions: TagSuggestion[] = [
        { id: 1, name: 'java' },
        { id: 2, name: 'spring' },
        { id: 3, name: 'react' },
        { id: 4, name: 'javascript' },
        { id: 5, name: 'typescript' },
        { id: 6, name: 'sql' },
        { id: 7, name: 'database' },
        { id: 8, name: 'hibernate' },
        { id: 9, name: 'jpa' },
        { id: 10, name: 'spring-boot' },
    ];

    useEffect(() => {
        if (tagInput.trim()) {
            const filtered = mockTagSuggestions.filter(
                tag => tag.name.toLowerCase().includes(tagInput.toLowerCase())
            );
            setTagSuggestions(filtered);
        } else {
            setTagSuggestions([]);
        }
    }, [tagInput]);

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
        setShowSuggestions(true);
    };

    const addTag = (tag: TagSuggestion) => {
        if (!selectedTags.some(t => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setTagInput('');
        setShowSuggestions(false);
    };

    const removeTag = (id: number) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== id));
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

        const questionData = {
            title,
            content,
            tagIds: selectedTags.map(tag => tag.id)
        };

        const newQuestionId = await submitQuestion(questionData);

        if (newQuestionId) {
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
                                    <input
                                        type="text"
                                        id="tags"
                                        value={tagInput}
                                        onChange={handleTagInputChange}
                                        placeholder="e.g. spring, java, database"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />

                                    {showSuggestions && tagSuggestions.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto border border-gray-200">
                                            {tagSuggestions.map(tag => (
                                                <div
                                                    key={tag.id}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => addTag(tag)}
                                                >
                                                    {tag.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
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