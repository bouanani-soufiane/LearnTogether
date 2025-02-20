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


    @PostMapping("{userId}")
    public ResponseEntity<QuestionResponseDTO> create (
            @PathVariable long userId,
            @Valid @RequestBody QuestionCreateDTO question ) {

        QuestionResponseDTO newQuestion = service.create(question, userId);
        return ResponseEntity.ok(newQuestion);
    }

    @GetMapping()
    public PagedResult<QuestionResponseDTO> findQuestions (
            @RequestParam(name = "page", defaultValue = "1") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int pageSize
    ) {
        return service.findQuestions(pageNo, pageSize);
    }


    @PostMapping("/{questionId}/answers")
    public ResponseEntity<AnswerResponseDTO> addAnswer (
            @PathVariable long questionId,
            @Valid @RequestBody AnswerCreateDTO answerDto ) {

        AnswerResponseDTO response = service.addAnswer(questionId, answerDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{questionId}/votes")
    public ResponseEntity<VoteResponseDTO> addVoteToQuestion(
            @PathVariable Long questionId,
            @RequestBody @Valid VoteCreateDTO voteDto) {
        VoteResponseDTO response = service.addVoteToQuestion(questionId, voteDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/answers/{answerId}/votes")
    public ResponseEntity<VoteResponseDTO> addVoteToAnswer(
            @PathVariable Long answerId,
            @RequestBody @Valid VoteCreateDTO voteDto) {
        VoteResponseDTO response = service.addVoteToAnswer(answerId, voteDto);
        return ResponseEntity.ok(response);
    }
}

