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
import yc.ma.LearnTogether.content.application.dto.request.update.UpdateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.application.mapper.BlogMapper;
import yc.ma.LearnTogether.content.domain.model.Blog;
import yc.ma.LearnTogether.content.domain.model.ReviewStatus;
import yc.ma.LearnTogether.content.domain.repository.BlogRepository;
import yc.ma.LearnTogether.content.domain.service.BlogService;
import yc.ma.LearnTogether.user.infrastructure.userdetails.UserDetailsImpl;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultBlogService implements BlogService {

    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;
    private final SecurityUtils securityUtils;

    @Override
    public BlogResponseDTO findById ( Long id ) {
        Blog blog = getBlogById(id);
        return blogMapper.toResponseDto(blog);
    }

    @Override
    public PagedResult<BlogSummaryDTO> findAllBlogs ( int pageNo, int pageSize ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        var pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, sort);
        return new PagedResult<>(blogRepository.findAll(pageable).map(blogMapper::toSummaryDto));
    }

    @Override
    public PagedResult<BlogSummaryDTO> findBlogsByUserId ( Long userId, int pageNo, int pageSize ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        var pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, sort);
        return new PagedResult<>(blogRepository.findByUserId(userId, pageable).map(blogMapper::toSummaryDto));
    }

    @Override
    @Transactional
    public BlogResponseDTO createBlog ( CreateBlogRequest request ) {
        Long currentUserId = securityUtils.getCurrentUserId();

        Blog blog = Blog.create(
                currentUserId,
                request.title(),
                request.content()
        );

        Blog savedBlog = blogRepository.save(blog);
        log.info("Blog created: {}", savedBlog.getId());

        return blogMapper.toResponseDto(savedBlog);
    }

    @Override
    @Transactional
    public BlogResponseDTO updateBlog ( Long id, UpdateBlogRequest request ) {
        Blog blog = getBlogById(id);
        validateOwnership(blog);

        blog.update(request.title(), request.content());
        Blog updatedBlog = blogRepository.save(blog);
        log.info("Blog updated: {}", updatedBlog.getId());

        return blogMapper.toResponseDto(updatedBlog);
    }

    @Override
    @Transactional
    public void deleteBlog ( Long id ) {
        Blog blog = getBlogById(id);
        validateOwnership(blog);

        blogRepository.delete(blog);
        log.info("Blog deleted: {}", id);
    }

    @Override
    @Transactional
    public BlogResponseDTO incrementViews ( Long id ) {
        Blog blog = getBlogById(id);
        blog.incrementViews();
        Blog updatedBlog = blogRepository.save(blog);
        log.debug("Blog views incremented: {}", id);

        return blogMapper.toResponseDto(updatedBlog);
    }

    @Override
    @Transactional
    public BlogResponseDTO reviewBlog ( Long id, ReviewStatus status ) {
        Blog blog = getBlogById(id);
        validateAdminRole();

        if (status == ReviewStatus.APPROVED) {
            blog.approve();
        } else if (status == ReviewStatus.REJECTED) {
            blog.reject();
        }

        Blog updatedBlog = blogRepository.save(blog);
        log.info("Blog reviewed: {}, status: {}", id, status);

        return blogMapper.toResponseDto(updatedBlog);
    }

    @Override
    @Transactional
    public BlogResponseDTO likeBlog ( Long id ) {
        Blog blog = getBlogById(id);
        Long currentUserId = securityUtils.getCurrentUserId();

        if (!blog.isLikedBy(currentUserId)) {
            blog.addLike(currentUserId);
            blog = blogRepository.save(blog);
            log.debug("Blog liked: {} by user: {}", id, currentUserId);
        }

        return blogMapper.toResponseDto(blog);
    }

    @Override
    @Transactional
    public BlogResponseDTO unlikeBlog ( Long id ) {
        Blog blog = getBlogById(id);
        Long currentUserId = securityUtils.getCurrentUserId();

        if (blog.isLikedBy(currentUserId)) {
            blog.removeLike(currentUserId);
            blog = blogRepository.save(blog);
            log.debug("Blog unliked: {} by user: {}", id, currentUserId);
        }

        return blogMapper.toResponseDto(blog);
    }


    private Blog getBlogById ( Long id ) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog" ,id));
    }

    private void validateOwnership ( Blog blog ) {
        Long currentUserId = securityUtils.getCurrentUserId();
        if (!blog.getUserId().equals(currentUserId) && !isAdmin()) {
            throw new AccessDeniedException("You don't have permission to modify this blog");
        }
    }

    private boolean isAdmin () {
        try {
            UserDetailsImpl currentUser = securityUtils.getCurrentUser();
            return currentUser.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        } catch (Exception e) {
            return false;
        }
    }

    private void validateAdminRole () {
        if (!isAdmin()) {
            throw new AccessDeniedException("Only administrators can review blogs");
        }
    }
}