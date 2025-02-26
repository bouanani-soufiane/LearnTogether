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
    public PagedResult<BlogSummaryDTO> findAllBlogs(
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize) {
        return service.findAllBlogs(pageNo, pageSize);
    }

    @GetMapping("/user/{userId}")
    public PagedResult<BlogSummaryDTO> findBlogsByUserId(
            @PathVariable Long userId,
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize) {
        return service.findBlogsByUserId(userId, pageNo, pageSize);
    }

    @GetMapping("/my-blogs")
    public PagedResult<BlogSummaryDTO> findMyBlogs(
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize) {
        Long currentUserId = securityUtils.getCurrentUserId();
        return service.findBlogsByUserId(currentUserId, pageNo, pageSize);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponseDTO> findBlogById( @PathVariable Long id) {
        return ResponseEntity.ok(service.incrementViews(id));
    }

    @PostMapping
    public ResponseEntity<BlogResponseDTO> createBlog(@RequestBody CreateBlogRequest request) {
        return new ResponseEntity<>(service.createBlog(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogResponseDTO> updateBlog(
            @PathVariable Long id,
            @RequestBody UpdateBlogRequest request) {
        return ResponseEntity.ok(service.updateBlog(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        service.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<BlogResponseDTO> reviewBlog(
            @PathVariable Long id,
            @RequestBody ReviewBlogRequest request) {
        return ResponseEntity.ok(service.reviewBlog(id, request.status()));
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity<BlogResponseDTO> likeBlog(@PathVariable Long id) {
        return ResponseEntity.ok(service.likeBlog(id));
    }

    @DeleteMapping("/{id}/likes")
    public ResponseEntity<BlogResponseDTO> unlikeBlog(@PathVariable Long id) {
        return ResponseEntity.ok(service.unlikeBlog(id));
    }
}