import React from 'react';
import { Link } from 'react-router-dom';
import { QuestionResponseDTO, calculateVoteTotal } from '../services/questionService';
import { FaCheck } from 'react-icons/fa';

interface QuestionCardProps {
    question: QuestionResponseDTO;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const minutes = Math.floor(diffInHours * 60);
            return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(date);
        }
    };

    const truncateContent = (content: string, maxLength: number = 200) => {
        const plainText = content.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    const hasAcceptedAnswer = question.answers &&
        question.answers.some(answer => answer.valid);

    const votesCount = calculateVoteTotal(question.votes);
    const answersCount = question.answers ? question.answers.length : 0;

    return (
        <div className="border-b border-gray-200 py-4 px-2 hover:bg-gray-50 transition-colors">
            <div className="flex">
                <div className="flex flex-col items-center space-y-2 mr-4 min-w-[80px] text-center">
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-medium text-gray-700">{votesCount}</span>
                        <span className="text-xs text-gray-500">votes</span>
                    </div>

                    <div className={`flex flex-col items-center ${
                        hasAcceptedAnswer ? 'text-green-700 border border-green-500 rounded px-2 py-1' : ''
                    }`}>
                        <div className="flex items-center">
                            {hasAcceptedAnswer && <FaCheck size={12} className="mr-1" />}
                            <span className="text-lg font-medium">{answersCount}</span>
                        </div>
                        <span className="text-xs">answers</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-lg font-medium text-gray-700">{question.viewCount || 0}</span>
                        <span className="text-xs text-gray-500">views</span>
                    </div>
                </div>

                {/* Question content */}
                <div className="flex-1">
                    <Link
                        to={`/questions/${question.id}`}
                        className="text-lg text-blue-700 hover:text-blue-900 font-medium mb-2 block"
                    >
                        {question.title}
                    </Link>

                    <div className="text-sm text-gray-600 mb-3">{truncateContent(question.content)}</div>

                    <div className="flex justify-between items-center">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                            {question.tags && question.tags.map(tag => (
                                <Link
                                    key={tag.id}
                                    to={`/tags/${tag.name}`}
                                    className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-xs"
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>

                        {/* User info */}
                        <div className="flex items-center text-xs text-gray-600">
                            <span className="whitespace-nowrap">
                                asked {formatDate(question.createdAt)}
                                {question.user && (
                                    <span> by <Link
                                        to={`/profile/${question.user.id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {question.user.username}
                                    </Link></span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;