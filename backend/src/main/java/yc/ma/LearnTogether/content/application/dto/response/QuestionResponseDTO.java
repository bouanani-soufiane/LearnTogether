package yc.ma.LearnTogether.content.application.dto.response;

import java.util.Set;

public record QuestionResponseDTO(
        Long id,
        Long userId,
        String title,
        String content,
        Set<AnswerResponseDTO> answers,
        Set<VoteResponseDTO> votes,
        Set<TagResponseDTO> tags

) {
}
