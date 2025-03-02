package yc.ma.LearnTogether.user.domain.model;


import lombok.*;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.time.LocalDate;


@Table(name = "profiles", schema = "youcoder")
@Getter
@AllArgsConstructor( onConstructor = @__(@PersistenceCreator))
@NoArgsConstructor
public class Profile {

    @Column("user_id")
    private @With Long userId;

    private String bio;

    private String location;

    @Column("website_link")
    private String websiteLink;

    private LocalDate birthdate;

    @Column("joined_at")
    private Instant joinedAt;


    public static Profile createDefault() {
        Profile profile = new Profile();
        profile.joinedAt = Instant.now();
        return profile;
    }

    public void update(Profile profile) {
        if (birthdate != null && birthdate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Birthdate cannot be in the future");
        }
        this.bio = profile.getBio();
        this.location = profile.getLocation();
        this.websiteLink = profile.getWebsiteLink();
        this.birthdate = profile.getBirthdate();
    }


}
