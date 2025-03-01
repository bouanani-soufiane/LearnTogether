package yc.ma.LearnTogether.user.application.dto.response;
import java.time.Instant;

import java.time.LocalDate;

public record ProfileResponseDTO(
        Long userId,
        String bio,
        String location,
        String websiteLink,
        LocalDate birthdate,
        Instant joinedAt
) {
}
