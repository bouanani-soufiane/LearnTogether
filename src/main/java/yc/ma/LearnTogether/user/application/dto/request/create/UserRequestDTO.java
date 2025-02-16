package yc.ma.LearnTogether.user.application.dto.request.create;

import yc.ma.LearnTogether.user.domain.model.UserRole;
import yc.ma.LearnTogether.user.domain.model.UserStatus;

public record UserRequestDTO(
//        @NotNull
        String fullName,
//        @UniqueValue(fieldName = "email" , entityClass = User.class , message = "email should be unique")
        String email,
        String password,
        UserStatus status,
        UserRole role
) {
}
