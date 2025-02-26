package yc.ma.LearnTogether.content.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.content.domain.service.TagService;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/questions/{questionId}/tags")
@RequiredArgsConstructor
public class QuestionTagController {

    private final TagService tagService;

    @PutMapping
    @PreAuthorize("@questionAuthorizationService.canEditQuestion(#questionId)")
    public ResponseEntity<Void> addTagsToQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody Set<Long> tagIds) {
        tagService.addTagsToQuestion(questionId, tagIds);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{tagId}")
    @PreAuthorize("@questionAuthorizationService.canEditQuestion(#questionId)")
    public ResponseEntity<Void> removeTagFromQuestion(
            @PathVariable Long questionId,
            @PathVariable Long tagId) {
        tagService.removeTagFromQuestion(questionId, tagId);
        return ResponseEntity.noContent().build();
    }
}