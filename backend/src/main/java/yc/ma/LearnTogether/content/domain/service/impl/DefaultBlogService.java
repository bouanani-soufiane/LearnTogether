package yc.ma.LearnTogether.content.domain.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.common.domain.exception.NotFoundException;
import yc.ma.LearnTogether.common.infrastructure.security.SecurityUtils;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateCommentRequest;
import yc.ma.LearnTogether.content.application.dto.request.update.UpdateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.application.dto.response.CommentResponseDTO;
import yc.ma.LearnTogether.content.application.mapper.BlogMapper;
import yc.ma.LearnTogether.content.application.mapper.CommentMapper;
import yc.ma.LearnTogether.content.domain.model.Blog;
import yc.ma.LearnTogether.content.domain.model.Comment;
import yc.ma.LearnTogether.content.domain.model.ReviewStatus;
import yc.ma.LearnTogether.content.domain.model.Tag;
import yc.ma.LearnTogether.content.domain.repository.BlogRepository;
import yc.ma.LearnTogether.content.domain.repository.TagRepository;
import yc.ma.LearnTogether.content.domain.service.BlogService;
import yc.ma.LearnTogether.content.domain.service.TagService;
import yc.ma.LearnTogether.user.infrastructure.userdetails.UserDetailsImpl;

import java.util.Set;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultBlogService implements BlogService {
    private final BlogRepository blogRepository;
    private final TagRepository tagRepository;
    private final BlogMapper blogMapper;
    private final SecurityUtils securityUtils;
    private final TagService tagService;
    private final CommentMapper commentMapper;


    @Override
    public BlogResponseDTO findById(Long id) {
        return blogMapper.toResponseDto(getBlogWithTags(id));
    }

    @Override
    public PagedResult<BlogSummaryDTO> findAllBlogs(int pageNo, int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        var pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, sort);
        var blogPage = blogRepository.findAll(pageable);

        blogPage.forEach(blog -> blog.setTags(tagRepository.findByBlogId(blog.getId())));

        return new PagedResult<>(blogPage.map(blogMapper::toSummaryDto));
    }

    @Override
    public PagedResult<BlogSummaryDTO> findBlogsByUserId(Long userId, int pageNo, int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        var pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, sort);
        var blogPage = blogRepository.findByUserId(userId, pageable);

        blogPage.forEach(blog -> blog.setTags(tagRepository.findByBlogId(blog.getId())));

        return new PagedResult<>(blogPage.map(blogMapper::toSummaryDto));
    }

    @Override
    @Transactional
    public BlogResponseDTO createBlog(CreateBlogRequest request) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Blog blog = Blog.create(currentUserId, request.title(), request.content());
        Blog savedBlog = blogRepository.save(blog);
        log.info("Blog created: {}", savedBlog.getId());

        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            tagService.addTagsToBlog(savedBlog.getId(), request.tagIds());
        }

        return blogMapper.toResponseDto(getBlogWithTags(savedBlog.getId()));
    }

    @Override
    @Transactional
    public BlogResponseDTO updateBlog(Long id, UpdateBlogRequest request) {
        Blog blog = getBlogWithTags(id);
        validateOwnership(blog);

        blog.update(request.title(), request.content());
        Blog updatedBlog = blogRepository.save(blog);

        if (request.tagIds() != null) {
            tagService.addTagsToBlog(id, request.tagIds());
        }

        log.info("Blog updated: {}", updatedBlog.getId());

        return blogMapper.toResponseDto(getBlogWithTags(id));
    }

    @Override
    @Transactional
    public void deleteBlog(Long id) {
        Blog blog = getBlogWithTags(id);
        validateOwnership(blog);
        blogRepository.delete(blog);
        log.info("Blog deleted: {}", id);
    }

    @Override
    @Transactional
    public BlogResponseDTO incrementViews(Long id) {
        Blog blog = getBlogWithTags(id);
        blog.incrementViews();
        Blog updatedBlog = blogRepository.save(blog);
        log.debug("Blog views incremented: {}", id);
        return blogMapper.toResponseDto(getBlogWithTags(updatedBlog.getId()));
    }

    @Override
    @Transactional
    public BlogResponseDTO reviewBlog(Long id, ReviewStatus status) {
        Blog blog = getBlogWithTags(id);
        validateAdminRole();

        if (status == ReviewStatus.APPROVED) {
            blog.approve();
        } else if (status == ReviewStatus.REJECTED) {
            blog.reject();
        }

        Blog updatedBlog = blogRepository.save(blog);
        log.info("Blog reviewed: {}, status: {}", id, status);

        return blogMapper.toResponseDto(getBlogWithTags(updatedBlog.getId()));
    }

    @Override
    @Transactional
    public BlogResponseDTO likeBlog(Long id) {
        Blog blog = getBlogWithTags(id);
        Long currentUserId = securityUtils.getCurrentUserId();

        if (!blog.isLikedBy(currentUserId)) {
            blog.addLike(currentUserId);
            blog = blogRepository.save(blog);
            log.debug("Blog liked: {} by user: {}", id, currentUserId);
        }

        return blogMapper.toResponseDto(getBlogWithTags(blog.getId()));
    }

    @Override
    @Transactional
    public BlogResponseDTO unlikeBlog(Long id) {
        Blog blog = getBlogWithTags(id);
        Long currentUserId = securityUtils.getCurrentUserId();

        if (blog.isLikedBy(currentUserId)) {
            blog.removeLike(currentUserId);
            blog = blogRepository.save(blog);
            log.debug("Blog unliked: {} by user: {}", id, currentUserId);
        }

        return blogMapper.toResponseDto(getBlogWithTags(blog.getId()));
    }

    @Override
    @Transactional
    public CommentResponseDTO addComment(Long blogId, CreateCommentRequest request) {
        Blog blog = getBlogWithTags(blogId);
        Long currentUserId = securityUtils.getCurrentUserId();

        Comment comment = blog.addComment(currentUserId, request.content());
        Blog updatedBlog = blogRepository.save(blog);

        // Find the newly created comment by matching the content
        Comment savedComment = updatedBlog.getComments().stream()
                .filter(c -> c.getContent().equals(request.content()) && c.getUserId().equals(currentUserId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Comment" , comment.getId()));

        log.info("Comment added to blog: {}, comment id: {}", blogId, savedComment.getId());

        return commentMapper.toResponseDto(savedComment);
    }

    @Override
    @Transactional
    public void deleteComment(Long blogId, Long commentId) {
        Blog blog = getBlogWithTags(blogId);
        Long currentUserId = securityUtils.getCurrentUserId();

        boolean isRemoved = blog.removeComment(commentId, currentUserId);

        if (!isRemoved && !isAdmin()) {
            throw new AccessDeniedException("You don't have permission to delete this comment");
        }

        blogRepository.save(blog);
        log.info("Comment deleted: {} from blog: {}", commentId, blogId);
    }

    private Blog getBlogWithTags(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog", id));

        Set<Tag> tags = tagRepository.findByBlogId(id);
        blog.setTags(tags);

        return blog;
    }

    private void validateOwnership(Blog blog) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (!blog.getUserId().equals(currentUserId) && !isAdmin()) {
            throw new AccessDeniedException("You don't have permission to modify this blog");
        }
    }

    private boolean isAdmin() {
        try {
            UserDetailsImpl currentUser = securityUtils.getCurrentUser();
            return currentUser.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        } catch (Exception e) {
            return false;
        }
    }

    private void validateAdminRole() {
        if (!isAdmin()) {
            throw new AccessDeniedException("Only administrators can review blogs");
        }
    }
}