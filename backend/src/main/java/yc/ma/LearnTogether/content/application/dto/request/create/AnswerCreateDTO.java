package yc.ma.LearnTogether.content.application.dto.request.create;

public record AnswerCreateDTO(
        Long userId,
        String content
) {
    public static AnswerCreateDTO of(Long userId, String content) {
        return new AnswerCreateDTO(userId, content);
    }
}