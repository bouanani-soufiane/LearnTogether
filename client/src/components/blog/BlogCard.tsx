import React from 'react';
import {Link} from 'react-router-dom';
import {BlogSummaryDTO, ReviewStatus} from '../../types/blogTypes';
import {Eye, Heart, MessageSquare} from 'lucide-react';
import {useAuthStore} from '../../store/authStore';
import {UserRole} from '../../types';

interface BlogCardProps {
    blog: BlogSummaryDTO;
}

const BlogCard: React.FC<BlogCardProps> = ({blog}) => {
    const {user} = useAuthStore();
    const isTeacher = user?.role === UserRole.TEACHER;
    const isAdmin = user?.role === UserRole.ADMIN;
    const canReview = isTeacher || isAdmin;

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
        <div
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-sky-100/50 overflow-hidden">
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <Link to={`/blog/${blog.id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-sky-600 transition-colors line-clamp-2">
                            {blog.title}
                        </h3>
                    </Link>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blog.reviewStatus)}`}>
            {blog.reviewStatus}
          </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {blog.tags.map(tag => (
                        <span
                            key={tag.id}
                            className="px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded-md"
                        >
              {tag.name}
            </span>
                    ))}
                </div>

                <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
                    <div className="flex items-center gap-4">
         <span className="flex items-center gap-1">
  <Heart
      size={14}
      className={blog.likedByCurrentUser ? "text-red-500 fill-red-500" : "text-orange-400"}
  />
             {blog.likeCount}
</span>
                        <span className="flex items-center gap-1">
              <MessageSquare size={14} className="text-sky-400"/>
                            {blog.commentCount}
            </span>
                        <span className="flex items-center gap-1">
              <Eye size={14} className="text-gray-400"/>
                            {blog.views}
            </span>
                    </div>

                    <div className="flex items-center">
                        {canReview && blog.reviewStatus === ReviewStatus.PENDING && (
                            <Link
                                to={`/blog/${blog.id}`}
                                className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-600 px-2 py-1 rounded-md transition-colors mr-2"
                            >
                                Review
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;