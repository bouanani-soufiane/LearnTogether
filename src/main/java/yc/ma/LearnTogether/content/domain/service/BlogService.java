package yc.ma.LearnTogether.content.domain.service;

import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.request.update.UpdateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

public interface BlogService {
    BlogResponseDTO findById( Long id);
    PagedResult<BlogSummaryDTO> findAllBlogs( int pageNo, int pageSize);
    PagedResult<BlogSummaryDTO> findBlogsByUserId(Long userId, int pageNo, int pageSize);
    BlogResponseDTO createBlog( CreateBlogRequest request);
    BlogResponseDTO updateBlog(Long id, UpdateBlogRequest request);
    void deleteBlog(Long id);
    BlogResponseDTO incrementViews(Long id);
    BlogResponseDTO reviewBlog(Long id, ReviewStatus status);
    BlogResponseDTO likeBlog(Long id);
    BlogResponseDTO unlikeBlog(Long id);
}