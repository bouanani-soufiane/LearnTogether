package yc.ma.LearnTogether.user.application.dto.response;

import yc.ma.LearnTogether.user.domain.model.UserRole;
import yc.ma.LearnTogether.user.domain.model.UserStatus;

public record UserResponseDTO(
        Long id,
        String fullName,
        String email,
        UserStatus status,
        UserRole role,
        ProfileResponseDTO profile
) {
}
