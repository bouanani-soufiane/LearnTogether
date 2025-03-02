package yc.ma.LearnTogether.content.domain.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import yc.ma.LearnTogether.common.infrastructure.security.SecurityUtils;
import yc.ma.LearnTogether.content.domain.repository.BlogRepository;

@Service("blogAuthorizationService")
@RequiredArgsConstructor
public class BlogAuthorizationService {

    private final BlogRepository blogRepository;
    private final SecurityUtils securityUtils;

    public boolean canEditBlog(Long blogId) {
        Long currentUserId = securityUtils.getCurrentUserId();
        return blogRepository.findById(blogId)
                .map(blog -> blog.getUserId().equals(currentUserId))
                .orElse(false);
    }
}
