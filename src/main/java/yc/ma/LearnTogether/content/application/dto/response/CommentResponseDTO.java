package yc.ma.LearnTogether.content.application.dto.response;

public record CommentResponseDTO(
        Long id,
        Long userId,
        String content,
        Long blogId
) {
}