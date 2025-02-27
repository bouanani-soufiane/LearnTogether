i want to make adding comment to blog with ddd while the blog is the aggregate root and has comment entity in it with one to many

using spring data jdbc and liquibase and spring boot and mapstruct is configured to map dto with recod java to entities

here is the code please add all neeeded things


```
databaseChangeLog:
  - include:
      file: db/changelog/migrations/V1__create_schemas.sql
  - include:
      file: db/changelog/migrations/user-changelog.sql
  - include:
      file: db/changelog/migrations/reputation-changelog.sql
  - include:
      file: db/changelog/migrations/content-changelog.sql
  - include:
      file: db/changelog/migrations/media-changelog.sql
  - include:
      file: db/changelog/migrations/clubs-changelog.sql
```


```
-- Set the search path to the 'content' schema
SET search_path TO content;
-- Create the enum type
CREATE TYPE content.review_status_enum AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- Set up implicit casting
CREATE CAST (varchar AS content.review_status_enum) WITH INOUT AS IMPLICIT;
-- Create the 'questions' table
CREATE TABLE content.questions
(
    id      SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title   TEXT    NOT NULL,
    content TEXT    NOT NULL
);

-- Create the 'answers' table
CREATE TABLE content.answers
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    content     TEXT    NOT NULL,
    is_valid    BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES content.questions (id) ON DELETE CASCADE
);

-- Create the 'votes' table
CREATE TABLE content.votes
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    question_id INTEGER,
    answer_id   INTEGER,
    value       INTEGER NOT NULL CHECK (value IN (-1, 1)),
    CHECK ((question_id IS NOT NULL AND answer_id IS NULL) OR (question_id IS NULL AND answer_id IS NOT NULL)),
    FOREIGN KEY (question_id) REFERENCES content.questions (id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES content.answers (id) ON DELETE CASCADE
);

-- Create the 'tags' table
CREATE TABLE content.tags
(
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create the 'question_tags' table for many-to-many relationship between questions and tags
CREATE TABLE content.question_tags
(
    id      SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    tag_id      INTEGER NOT NULL,
    UNIQUE (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES content.questions (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES content.tags (id) ON DELETE CASCADE
);


-- Create the 'blogs' table
CREATE TABLE content.blogs
(
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER                    NOT NULL,
    title         TEXT                       NOT NULL,
    content       TEXT                       NOT NULL,
    views         INTEGER DEFAULT 0,
    review_status content.review_status_enum NOT NULL,
    reviewed_at   DATE
);

-- Create the 'blog_tags' table for many-to-many relationship between blogs and tags
CREATE TABLE content.blog_tags
(
    id      SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL,
    tag_id  INTEGER NOT NULL,
    UNIQUE (blog_id, tag_id),
    FOREIGN KEY (blog_id) REFERENCES content.blogs (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES content.tags (id) ON DELETE CASCADE
);

-- Create the 'comments' table
CREATE TABLE content.comments
(
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL,
    content        TEXT    NOT NULL,
    blog_id  INTEGER NOT NULL,
    FOREIGN KEY (blog_id) REFERENCES content.blogs (id) ON DELETE CASCADE
);

-- Create the 'likes' table
CREATE TABLE content.likes
(
    id       SERIAL PRIMARY KEY,
    user_id  INTEGER NOT NULL,
    blog_id  INTEGER NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_id) REFERENCES content.blogs (id) ON DELETE CASCADE
);

```


```
package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "comments", schema = "content")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
@NoArgsConstructor
@ToString
public class Comment {
    @Id
    private Long id;
    private Long userId;
    private String content;
}
```


```
package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Embedded;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table(name = "blogs", schema = "content")
@Getter
@ToString
@NoArgsConstructor
public class Blog {
    @Id
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private Integer views;

    private ReviewStatus reviewStatus;

    private LocalDate reviewedAt;

    @MappedCollection(idColumn = "blog_id")
    private Set likes;

    @MappedCollection(idColumn = "blog_id")
    private Set tagReferences;

    @Transient
    private Set tags;


    @PersistenceCreator
    public Blog(Long id, Long userId, String title, String content, Integer views,
                ReviewStatus reviewStatus, LocalDate reviewedAt, Set likes,
                Set tagReferences) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.views = views != null ? views : 0;
        this.reviewStatus = reviewStatus;
        this.reviewedAt = reviewedAt;
        this.likes = likes != null ? likes : new HashSet<>();
        this.tagReferences = tagReferences != null ? tagReferences : new HashSet<>();
        this.tags = new HashSet<>();
    }

    public static Blog create(Long userId, String title, String content) {
        Blog blog = new Blog();
        blog.userId = userId;
        blog.title = title;
        blog.content = content;
        blog.views = 0;
        blog.reviewStatus = ReviewStatus.PENDING;
        blog.likes = new HashSet<>();
        blog.tagReferences = new HashSet<>();
        blog.tags = new HashSet<>();
        return blog;
    }

    public void addTag(Tag tag) {
        if (tag.getId() == null) {
            throw new IllegalArgumentException("Tag must be persisted before adding to blog");
        }
        this.tagReferences.add(BlogTagReference.create(this.id, tag.getId()));
        if (this.tags == null) {
            this.tags = new HashSet<>();
        }
        this.tags.add(tag);
    }

    public void removeTag(Long tagId) {
        this.tagReferences.removeIf(ref -> ref.getTagId().equals(tagId));
        if (this.tags != null) {
            this.tags.removeIf(tag -> tag.getId().equals(tagId));
        }
    }

    public void setTags(Set tags) {
        this.tags = tags;
    }

    public void incrementViews() {
        this.views = this.views + 1;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void approve() {
        this.reviewStatus = ReviewStatus.APPROVED;
        this.reviewedAt = LocalDate.now();
    }

    public void reject() {
        this.reviewStatus = ReviewStatus.REJECTED;
        this.reviewedAt = LocalDate.now();
    }

    public void addLike(Long userId) {
        Like newLike = Like.create(userId, this.id);
        this.likes.add(newLike);
    }

    public void removeLike(Long userId) {
        this.likes.removeIf(like -> like.getUserId().equals(userId));
    }

    @Transient
    public int getLikeCount() {
        return likes != null ? likes.size() : 0;
    }

    @Transient
    public boolean isLikedBy(Long userId) {
        return likes != null && likes.stream().anyMatch(like -> like.getUserId().equals(userId));
    }
    public void setTagReferences(Set tagReferences) {
        this.tagReferences = tagReferences;
    }
}
```


```
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
```


```
package yc.ma.LearnTogether.content.web;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.common.infrastructure.security.SecurityUtils;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.request.create.ReviewBlogRequest;
import yc.ma.LearnTogether.content.application.dto.request.update.UpdateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.domain.service.BlogService;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService service;
    private final SecurityUtils securityUtils;

    @GetMapping
    public PagedResult findAllBlogs(
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize) {
        return service.findAllBlogs(pageNo, pageSize);
    }

    @GetMapping("/user/{userId}")
    public PagedResult findBlogsByUserId(
            @PathVariable Long userId,
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize) {
        return service.findBlogsByUserId(userId, pageNo, pageSize);
    }

    @GetMapping("/my-blogs")
    public PagedResult findMyBlogs(
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize) {
        Long currentUserId = securityUtils.getCurrentUserId();
        return service.findBlogsByUserId(currentUserId, pageNo, pageSize);
    }

    @GetMapping("/{id}")
    public ResponseEntity findBlogById( @PathVariable Long id) {
        return ResponseEntity.ok(service.incrementViews(id));
    }

    @PostMapping
    public ResponseEntity createBlog(@RequestBody CreateBlogRequest request) {
        return new ResponseEntity<>(service.createBlog(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateBlog(
            @PathVariable Long id,
            @RequestBody UpdateBlogRequest request) {
        return ResponseEntity.ok(service.updateBlog(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteBlog(@PathVariable Long id) {
        service.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/review")
    public ResponseEntity reviewBlog(
            @PathVariable Long id,
            @RequestBody ReviewBlogRequest request) {
        return ResponseEntity.ok(service.reviewBlog(id, request.status()));
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity likeBlog(@PathVariable Long id) {
        return ResponseEntity.ok(service.likeBlog(id));
    }

    @DeleteMapping("/{id}/likes")
    public ResponseEntity unlikeBlog(@PathVariable Long id) {
        return ResponseEntity.ok(service.unlikeBlog(id));
    }
}
```


```
package yc.ma.LearnTogether.content.application.dto.request.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;

import java.util.Set;

public record CreateBlogRequest(
        @NotBlank(message = "Title cannot be empty")
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        @UniqueValue(schemaName = "content", tableName = "blogs", fieldName = "title", message = "title should be unique")
        String title,

        @NotBlank(message = "Content cannot be empty")
        @Size(min = 10, message = "Content must be at least 10 characters")
        String content,

        Set tagIds
) {}
```


```
package yc.ma.LearnTogether.content.application.dto.response;

import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

import java.time.LocalDate;
import java.util.Set;

public record BlogResponseDTO(
        Long id,
        Long userId,
        String title,
        String content,
        Integer views,
        ReviewStatus reviewStatus,
        LocalDate reviewedAt,
        int likeCount,
        boolean likedByCurrentUser,
        Set tags

) {
}
```


```
package yc.ma.LearnTogether.content.application.dto.response;

import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

import java.util.Set;

public record BlogSummaryDTO(
        Long id,
        Long userId,
        String title,
        Integer views,
        ReviewStatus reviewStatus,
        int likeCount,
        Set tags
) {
}
```


```
package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.domain.model.Blog;

@Mapper(config = BaseMapper.class)

public interface BlogMapper extends BaseMapper {
    BlogSummaryDTO toSummaryDto( Blog blog);
}
```


```
package yc.ma.LearnTogether.common.application.mapper;


import org.mapstruct.MapperConfig;
import org.mapstruct.ReportingPolicy;

@MapperConfig(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BaseMapper {
    ENTITY toEntity ( REQUEST dto );

    RESPONSE toResponseDto ( ENTITY entity );
}
```

```
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

```