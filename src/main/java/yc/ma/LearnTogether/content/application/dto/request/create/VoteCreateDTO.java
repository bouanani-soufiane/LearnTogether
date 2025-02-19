package yc.ma.LearnTogether.content.application.dto.request.create;

public record VoteCreateDTO(
        Long userId,
        int value
) {
}
