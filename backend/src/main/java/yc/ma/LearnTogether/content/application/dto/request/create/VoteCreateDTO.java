package yc.ma.LearnTogether.content.application.dto.request.create;

public record VoteCreateDTO(
        Long userId,
        Integer value
) {
    public static VoteCreateDTO of(Long userId, Integer value) {
        return new VoteCreateDTO(userId, value);
    }
}