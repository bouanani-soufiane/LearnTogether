package yc.ma.LearnTogether.user.application.dto.request.create;

import java.time.LocalDate;

public record ProfileCreateDTO(
        String bio,
        String location,
        String websiteLink,
        LocalDate birthdate
) {
}
