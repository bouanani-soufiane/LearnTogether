import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSort, FaStar, FaCalendarAlt } from 'react-icons/fa';
import QuestionCard from '../../components/QuestionCard';
import { useQuestionStore } from '../../store/questionStore';
import Sidebar from '../../components/Sidebar';

const Home: React.FC = () => {
    const {
        questions,
        isQuestionsLoading,
        questionsError,
        currentPage,
        sortOption,
        fetchQuestions
    } = useQuestionStore();

    useEffect(() => {
        fetchQuestions(currentPage, sortOption);
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchQuestions(newPage, sortOption);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (newSort: string) => {
        fetchQuestions(1, newSort);
        window.scrollTo(0, 0);
    };

    const renderPagination = () => {
        if (!questions) return null;

        const { totalPages, pageNumber } = questions;
        const pages = [];

        pages.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1 ${
                    pageNumber === 1 ? "bg-orange-100 text-orange-800 font-medium" : "text-gray-700 hover:bg-gray-100"
                } rounded`}
            >
                1
            </button>
        );

        let startPage = Math.max(2, pageNumber - 1);
        let endPage = Math.min(totalPages, pageNumber + 3);

        if (startPage > 2) {
            pages.push(<span key="ellipsis1" className="px-2">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 ${
                        pageNumber === i
                            ? 'bg-orange-100 text-orange-600 font-medium'
                            : 'text-orange-900 hover:bg-gray-100'
                    } rounded`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages - 1) {
            pages.push(<span key="ellipsis2" className="px-2">...</span>);
        }

        // Always show last page if more than one page exists
        if (totalPages > 1 && endPage !== totalPages) {
            pages.push(
                <button
                    key="last"
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-1 ${
                        pageNumber === totalPages
                            ? 'bg-orange-100 text-orange-800 font-medium'
                            : 'text-orange-600 hover:bg-gray-100'
                    } rounded`}
                >
                    {totalPages}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center space-x-1 mt-6">
                <button
                    onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber === 1}
                    className="px-3 py-1 text-orange-600 hover:bg-gray-100 rounded disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                    Prev
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(Math.min(totalPages, pageNumber + 1))}
                    disabled={pageNumber === totalPages}
                    className="px-3 py-1 text-orange-600 hover:bg-gray-100 rounded disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 ml-0 md:ml-[200px] p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Top Questions</h1>
                        <Link
                            to="/questions/ask"
                            className="bg-orange-100 text-orange-800 hover:bg-orange-200  hover:text-orange-900  px-4 py-2 rounded-md text-sm font-medium flex items-center shadow-sm transition-colors"
                        >
                            <FaPlus className="mr-1" />
                            Ask Question
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 border border-gray-200 rounded-md shadow-sm">
                        <div className="text-sm text-gray-600 mb-2 md:mb-0">
                            {questions?.totalElements || 0} questions
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => handleSortChange('newest')}
                                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded ${
                                    sortOption === 'newest'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                <FaCalendarAlt className="mr-1" /> Newest
                            </button>
                            <button
                                onClick={() => handleSortChange('votes')}
                                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded ${
                                    sortOption === 'votes'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                <FaStar className="mr-1" /> Votes
                            </button>
                        </div>
                    </div>

                    {/* Questions list */}
                    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                        {isQuestionsLoading ? (
                            <div className="flex justify-center items-center p-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
                            </div>
                        ) : questionsError ? (
                            <div className="text-center p-10 text-red-600">
                                <p className="mb-2">Error loading questions:</p>
                                <p>{questionsError}</p>
                                <button
                                    onClick={() => fetchQuestions(currentPage, sortOption)}
                                    className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : !questions || questions.data.length === 0 ? (
                            <div className="text-center p-10 text-gray-600">
                                <p className="mb-2">No questions found.</p>
                                <Link
                                    to="/questions/ask"
                                    className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 inline-block"
                                >
                                    Ask a Question
                                </Link>
                            </div>
                        ) : (
                            <div>
                                {questions.data.map((question) => (
                                    <QuestionCard key={question.id} question={question} />
                                ))}
                            </div>
                        )}
                    </div>

                    {!isQuestionsLoading && !questionsError && questions && renderPagination()}
                </div>
            </div>
        </div>
    );
};

export default Home;