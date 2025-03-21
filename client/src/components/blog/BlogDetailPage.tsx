import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useBlogStore} from '../../store/blogStore';
import {useAuthStore} from '../../store/authStore';
import {Clock, Edit, Eye, Heart, MessageSquare, Send, ThumbsDown, ThumbsUp, Trash} from 'lucide-react';
import {UserRole} from '../../types';
import {ReviewStatus} from '../../types/blogTypes';
import {formatDistanceToNow} from 'date-fns';

const BlogDetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const blogId = parseInt(id as string, 10);
    const navigate = useNavigate();

    const {
        currentBlog,
        isLoading,
        error,
        fetchBlogById,
        likeBlog,
        unlikeBlog,
        reviewBlog,
        addComment,
        deleteComment,
        deleteBlog
    } = useBlogStore();

    const {isAuthenticated, user} = useAuthStore();
    const [commentText, setCommentText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isOwner = user?.id === currentBlog?.userId;
    const isTeacher = user?.role === UserRole.TEACHER;
    const isAdmin = user?.role === UserRole.ADMIN;
    const canEdit = isOwner || isAdmin;
    const canReview = isTeacher && currentBlog?.reviewStatus === ReviewStatus.PENDING;
    const canLike = isAuthenticated;

    useEffect(() => {
        if (blogId) {
            fetchBlogById(blogId);
        }

        return () => {
            // Clear current blog when component unmounts
        };
    }, [blogId, fetchBlogById]);

    const handleLikeToggle = async () => {
        if (!isAuthenticated || !currentBlog) return;

        try {
            if (currentBlog.likedByCurrentUser) {
                await unlikeBlog(blogId);
            } else {
                await likeBlog(blogId);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleReview = async (status: ReviewStatus) => {
        if (!canReview || !currentBlog) return;

        try {
            await reviewBlog(blogId, status);
        } catch (err) {
            console.error('Error reviewing blog:', err);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !isAuthenticated || !currentBlog) return;

        try {
            await addComment(blogId, {content: commentText.trim()});
            setCommentText('');
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!currentBlog) return;

        try {
            await deleteComment(blogId, commentId);
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const handleDeleteBlog = async () => {
        if (!canEdit || !currentBlog) return;

        try {
            await deleteBlog(blogId);
            navigate('/blog');
        } catch (err) {
            console.error('Error deleting blog:', err);
        }
    };

    if (isLoading && !currentBlog) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                <p className="mt-4 text-gray-600">Loading blog...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    if (!currentBlog) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-xl font-medium text-gray-700">Blog post not found</h3>
                <p className="text-gray-500 mt-2">The blog post you're looking for doesn't exist.</p>
                <Link
                    to="/blog"
                    className="inline-block mt-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg shadow-sm"
                >
                    Go back to blogs
                </Link>
            </div>
        );
    }

    const getStatusColor = (status: ReviewStatus) => {
        switch (status) {
            case ReviewStatus.APPROVED:
                return 'bg-green-100 text-green-800';
            case ReviewStatus.REJECTED:
                return 'bg-red-100 text-red-800';
            case ReviewStatus.PENDING:
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    to="/blog"
                    className="text-sky-600 hover:text-sky-800 transition-colors"
                >
                    ← Back to Blogs
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-sky-100/50 overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">{currentBlog.title}</h1>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentBlog.reviewStatus)}`}>
              {currentBlog.reviewStatus}
            </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {currentBlog.tags.map(tag => (
                            <span
                                key={tag.id}
                                className="px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded-md"
                            >
                {tag.name}
              </span>
                        ))}
                    </div>

                    <div className="mb-8 flex items-center text-gray-500 text-sm gap-4">
            <span className="flex items-center gap-1">
              <Eye size={16} className="text-gray-400"/>
                {currentBlog.views} views
            </span>
                        <span className="flex items-center gap-1">
              <Heart
                  size={16}
                  className={currentBlog.likedByCurrentUser ? "text-red-500 fill-red-500" : "text-gray-400"}
              />
                            {currentBlog.likeCount} likes
            </span>
                        <span className="flex items-center gap-1">
              <MessageSquare size={16} className="text-gray-400"/>
                            {currentBlog.commentCount} comments
            </span>
                        {currentBlog.reviewedAt && (
                            <span className="flex items-center gap-1">
                <Clock size={16} className="text-gray-400"/>
                Reviewed {formatDistanceToNow(new Date(currentBlog.reviewedAt), {addSuffix: true})}
              </span>
                        )}
                    </div>

                    <div className="prose max-w-none mb-6">
                        <div dangerouslySetInnerHTML={{__html: currentBlog.content}}></div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex gap-2">
                            {canLike && (
                                <button
                                    onClick={handleLikeToggle}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all duration-200 hover:shadow-sm"
                                    style={{
                                        borderColor: currentBlog.likedByCurrentUser ? '#fee2e2' : '#e5e7eb',
                                        backgroundColor: currentBlog.likedByCurrentUser ? '#fef2f2' : 'white',
                                    }}
                                >
                                    <Heart
                                        size={18}
                                        className={`transition-all duration-200 ${
                                            currentBlog.likedByCurrentUser
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span className={`text-sm font-medium ${
                                        currentBlog.likedByCurrentUser
                                            ? "text-red-500"
                                            : "text-gray-600"
                                    }`}>
      {currentBlog.likeCount > 0 && (
          <span className="mr-1">{currentBlog.likeCount}</span>
      )}
                                        {currentBlog.likedByCurrentUser ? 'Liked' : 'Like'}
    </span>
                                </button>
                            )}

                            <a
                                href="#comments"
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MessageSquare size={16}/>
                                Comments
                            </a>
                        </div>

                        <div className="flex gap-2">
                            {canEdit && (
                                <>
                                    <Link
                                        to={`/blog/${blogId}/edit`}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
                                    >
                                        <Edit size={16}/>
                                        Edit
                                    </Link>

                                    {!confirmDelete ? (
                                        <button
                                            onClick={() => setConfirmDelete(true)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <Trash size={16}/>
                                            Delete
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleDeleteBlog}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(false)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </>
                            )}

                            {canReview && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReview(ReviewStatus.APPROVED)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                        <ThumbsUp size={16}/>
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReview(ReviewStatus.REJECTED)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <ThumbsDown size={16}/>
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div id="comments" className="bg-white rounded-xl shadow-sm border border-sky-100/50 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Comments ({currentBlog.commentCount})</h2>

                    {isAuthenticated ? (
                        <form onSubmit={handleCommentSubmit} className="mb-6">
                            <div className="flex items-start gap-2">
                                <div className="flex-grow">
                  <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full p-3 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200"
                      placeholder="Add a comment..."
                      rows={3}
                  ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className={`px-4 py-2 rounded-lg text-white shadow-sm ${
                                        commentText.trim()
                                            ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 cursor-pointer'
                                            : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    <Send size={16}/>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-gray-600">
                                <Link to="/login" className="text-sky-600 hover:text-sky-800">Log in</Link> to add a
                                comment
                            </p>
                        </div>
                    )}

                    {currentBlog.comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentBlog.comments.map(comment => (
                                <div key={comment.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-orange-400 flex items-center justify-center shadow-sm text-white text-xs font-medium">
                                                U
                                            </div>
                                            <span className="font-medium text-gray-700">User {comment.userId}</span>
                                        </div>

                                        {(user?.id === comment.userId || isAdmin) && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash size={14}/>
                                            </button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-gray-700">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;