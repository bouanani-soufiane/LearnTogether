package yc.ma.LearnTogether.content.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.content.application.dto.request.create.AnswerCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.create.VoteCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.AnswerResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.VoteResponseDTO;
import yc.ma.LearnTogether.content.domain.service.QuestionService;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService service;

    @PostMapping("/{userId}")
    public ResponseEntity<QuestionResponseDTO> create(
            @PathVariable Long userId,
            @Valid @RequestBody QuestionCreateDTO question) {
        return ResponseEntity.ok(service.create(question, userId));
    }

    @GetMapping
    public PagedResult<QuestionResponseDTO> findQuestions(
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize) {
        return service.findQuestions(pageNo, pageSize);
    }

    @PostMapping("/{questionId}/answers")
    public ResponseEntity<AnswerResponseDTO> addAnswer(
            @PathVariable Long questionId,
            @Valid @RequestBody AnswerCreateDTO answerDto) {
        return ResponseEntity.ok(service.addAnswer(questionId, answerDto));
    }

    @PostMapping("/{questionId}/votes")
    public ResponseEntity<VoteResponseDTO> addVoteToQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody VoteCreateDTO voteDto) {
        return ResponseEntity.ok(service.addVoteToQuestion(questionId, voteDto));
    }

    @PostMapping("/answers/{answerId}/votes")
    public ResponseEntity<VoteResponseDTO> addVoteToAnswer(
            @PathVariable Long answerId,
            @Valid @RequestBody VoteCreateDTO voteDto) {
        return ResponseEntity.ok(service.addVoteToAnswer(answerId, voteDto));
    }
}