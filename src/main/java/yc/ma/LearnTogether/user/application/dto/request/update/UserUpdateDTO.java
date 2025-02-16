package yc.ma.LearnTogether.user.application.dto.request.update;

import yc.ma.LearnTogether.user.domain.model.UserRole;
import yc.ma.LearnTogether.user.domain.model.UserStatus;

public record UserUpdateDTO(
        String fullName,
        String email,
        String password,
        UserStatus status,
        UserRole role
) {
}
