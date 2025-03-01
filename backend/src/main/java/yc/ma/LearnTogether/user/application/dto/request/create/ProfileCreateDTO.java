package yc.ma.LearnTogether.user.application.dto.request.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record ProfileCreateDTO(
        @NotBlank
        String bio,
        @NotBlank
        String location,
        @NotBlank
        String websiteLink,
        @Past
        LocalDate birthdate
) {
}
