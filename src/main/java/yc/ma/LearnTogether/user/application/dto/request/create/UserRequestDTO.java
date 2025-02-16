package yc.ma.LearnTogether.user.application.dto.request.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;
import yc.ma.LearnTogether.user.domain.model.UserRole;
import yc.ma.LearnTogether.user.domain.model.UserStatus;

public record UserRequestDTO(
        @NotBlank String fullName,
        @UniqueValue(fieldName = "email", schemaName = "youcoder" , tableName = "users", message = "email should be unique")
        @NotBlank
        String email,
        @NotBlank
        String password,
        @NotNull
        UserStatus status,
        @NotNull
        UserRole role
) {
}
