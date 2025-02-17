package yc.ma.LearnTogether.user.application.dto.request.create;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;
import yc.ma.LearnTogether.user.domain.model.UserRole;

public record UserRequestDTO(
        @NotBlank String fullName,
        @UniqueValue(
                schemaName = "youcoder",
                tableName = "users",
                fieldName = "email",
                message = "email should be unique")
        @NotBlank @Email
        String email,

        @NotBlank @Size(min = 8 , message = "password must be min 8 characters")
        String password,

        @NotNull
        UserRole role
) {
}
