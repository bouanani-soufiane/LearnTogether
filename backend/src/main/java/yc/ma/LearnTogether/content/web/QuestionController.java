package yc.ma.LearnTogether.content.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.common.infrastructure.security.SecurityUtils;
import yc.ma.LearnTogether.content.application.dto.request.create.AnswerCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.create.VoteCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.update.QuestionUpdateDTO;
import yc.ma.LearnTogether.content.application.dto.response.AnswerResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.VoteResponseDTO;
import yc.ma.LearnTogether.content.domain.service.QuestionService;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService service;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<QuestionResponseDTO> create (
            @Valid @RequestBody QuestionCreateDTO question ) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(service.create(question, userId));
    }

    @GetMapping
    public PagedResult<QuestionResponseDTO> findQuestions (
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize ) {
        return service.findQuestions(pageNo, pageSize);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<QuestionResponseDTO> findQuestionById ( @PathVariable Long questionId ) {
        return ResponseEntity.ok(service.findById(questionId));
    }

    @PostMapping("/{questionId}/answers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AnswerResponseDTO> addAnswer (
            @PathVariable Long questionId,
            @Valid @RequestBody String content ) {
        Long userId = securityUtils.getCurrentUserId();
        AnswerCreateDTO answerDto = new AnswerCreateDTO(userId, content);
        return ResponseEntity.ok(service.addAnswer(questionId, answerDto));
    }

    @PostMapping("/{questionId}/votes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VoteResponseDTO> addVoteToQuestion (
            @PathVariable Long questionId,
            @Valid @RequestBody VoteCreateDTO voteCreateDTO ) {
        Long userId = securityUtils.getCurrentUserId();
        VoteCreateDTO voteDto = new VoteCreateDTO(userId, voteCreateDTO.value());
        return ResponseEntity.ok(service.addVoteToQuestion(questionId, voteDto));
    }

    @PostMapping("/answers/{answerId}/votes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VoteResponseDTO> addVoteToAnswer (
            @PathVariable Long answerId,
            @Valid @RequestBody VoteCreateDTO voteCreateDTO ) {
        Long userId = securityUtils.getCurrentUserId();
        VoteCreateDTO voteDto = new VoteCreateDTO(userId, voteCreateDTO.value());
        return ResponseEntity.ok(service.addVoteToAnswer(answerId, voteDto));
    }

    @DeleteMapping("/{questionId}")
    @PreAuthorize("@questionAuthorizationService.canDeleteQuestion(#questionId)")
    public ResponseEntity<Void> deleteQuestion ( @PathVariable Long questionId ) {
        service.delete(questionId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{questionId}")
    @PreAuthorize("@questionAuthorizationService.canEditQuestion(#questionId)")
    public ResponseEntity<QuestionResponseDTO> updateQuestion (
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionUpdateDTO questionUpdateDTO ) {
        return ResponseEntity.ok(service.update(questionId, questionUpdateDTO));
    }

    @PatchMapping("/answers/{answerId}/mark-valid")
    @PreAuthorize("@questionAuthorizationService.canMarkAnswerAsValid(#answerId)")
    public ResponseEntity<AnswerResponseDTO> markAnswerAsValid ( @PathVariable Long answerId ) {
        return ResponseEntity.ok(service.markAnswerAsValid(answerId));
    }
}