package yc.ma.LearnTogether.content.application.dto.response;

public record AnswerResponseDTO(
        Long id,
        Long userId,
        String content,
        boolean isValid
) {
}
