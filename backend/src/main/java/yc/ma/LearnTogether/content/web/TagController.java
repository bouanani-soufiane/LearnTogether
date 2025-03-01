package yc.ma.LearnTogether.content.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.content.application.dto.request.create.TagCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.update.TagUpdateDTO;
import yc.ma.LearnTogether.content.application.dto.response.TagResponseDTO;
import yc.ma.LearnTogether.content.domain.service.TagService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagResponseDTO>> getAllTags() {
        return ResponseEntity.ok(tagService.findAllTags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDTO> getTagById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TagResponseDTO>> searchTags(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(tagService.searchTags(query, limit));
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<Set<TagResponseDTO>> getTagsByBlogId(@PathVariable Long blogId) {
        return ResponseEntity.ok(tagService.findByBlogId(blogId));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<Set<TagResponseDTO>> getTagsByQuestionId(@PathVariable Long questionId) {
        return ResponseEntity.ok(tagService.findByQuestionId(questionId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TagResponseDTO> createTag(@Valid @RequestBody TagCreateDTO request) {
        return new ResponseEntity<>(tagService.createTag(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TagResponseDTO> updateTag(
            @PathVariable Long id,
            @Valid @RequestBody TagUpdateDTO request) {
        return ResponseEntity.ok(tagService.updateTag(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }
}