package yc.ma.LearnTogether.content.application.dto.response;

import java.util.Set;

public record AnswerResponseDTO(
        Long id,
        Long userId,
        String content,
        boolean valid,
        Set<VoteResponseDTO> votes
) {
}
