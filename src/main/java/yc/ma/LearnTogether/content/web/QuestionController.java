package yc.ma.LearnTogether.content.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;
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

        QuestionResponseDTO newQuestion = service.create(question , userId);
        return ResponseEntity.ok(newQuestion);
    }
}

