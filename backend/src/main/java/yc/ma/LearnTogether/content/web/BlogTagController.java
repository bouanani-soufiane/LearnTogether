package yc.ma.LearnTogether.content.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.content.domain.service.TagService;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/blogs/{blogId}/tags")
@RequiredArgsConstructor
public class BlogTagController {

    private final TagService tagService;

    @PutMapping
    @PreAuthorize("@blogAuthorizationService.canEditBlog(#blogId)")
    public ResponseEntity<Void> addTagsToBlog(
            @PathVariable Long blogId,
            @Valid @RequestBody Set<Long> tagIds) {
        tagService.addTagsToBlog(blogId, tagIds);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{tagId}")
    @PreAuthorize("@blogAuthorizationService.canEditBlog(#blogId)")
    public ResponseEntity<Void> removeTagFromBlog(
            @PathVariable Long blogId,
            @PathVariable Long tagId) {
        tagService.removeTagFromBlog(blogId, tagId);
        return ResponseEntity.noContent().build();
    }
}