package yc.ma.LearnTogether.user.domain.model;

import lombok.*;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.time.LocalDate;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
@NoArgsConstructor
@Table(name = "profiles", schema = "youcoder")

public class Profile {

    @Column("user_id")
    private @With Long userId;

    private String bio;
    private String location;

    @Column("website_link")
    private String websiteLink;

    private LocalDate birthdate;

    @Column("joined_at")
    private Instant joinedAt = Instant.now();
}
