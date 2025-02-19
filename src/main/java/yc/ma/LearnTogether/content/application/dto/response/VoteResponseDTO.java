package yc.ma.LearnTogether.content.application.dto.response;

public record VoteResponseDTO(
        Long id,
        Long userId,
        int value
) {}
