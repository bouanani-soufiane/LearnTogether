package yc.ma.LearnTogether.user.domain.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
@NoArgsConstructor()
@Table(name = "profiles", schema = "youcoder")
public class Profile {

    @Id
    private Long id;

    @Column("user_id")
    private Long userId;
    private String bio;
    private String location;
    private String websiteLink;
    private LocalDate birthdate;
    private LocalDate joinedAt;

}
