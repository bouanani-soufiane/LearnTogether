package yc.ma.LearnTogether.user.application.dto.response;

public record JwtResponseDTO(
        String token,
        String type,
        Long id,
        String email,
        String role
) {}