package yc.ma.LearnTogether.user.application.dto.projection;

import java.time.LocalDate;

public interface UserProjection {
    Long getId();
    String getFullName();
    String getEmail();
    String getRole();
    String getBio();
    String getWebsiteLink();
    LocalDate getBirthdate();
}