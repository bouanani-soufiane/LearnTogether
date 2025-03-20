package yc.ma.LearnTogether.user.domain.model;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Table(name = "users", schema = "youcoder")
@Getter
@AllArgsConstructor( onConstructor = @__(@PersistenceCreator))
@ToString
@NoArgsConstructor()
@Slf4j
public class User {

    private @Id
    @With Long id;

    @Column("full_name")
    private String fullName;

    private String email;

    private String password;

    private UserStatus status;

    private UserRole role;

    @MappedCollection(idColumn = "user_id")
    private Profile profile;

    public static User create ( String fullName, String email, String password, UserRole role ) {
        User user = new User();
        user.fullName = fullName;
        user.email = email;
        user.password = password;
        user.role = role;
        user.status = UserStatus.ACTIVE;
        user.profile = Profile.createDefault();
        return user;
    }


    public void updateDetails ( String fullName, String email, String password ) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }


    public void setProfileData(String bio, String location, String websiteLink, LocalDate birthdate) {
        log.info("Setting profile data: bio={}, location={}, websiteLink={}, birthdate={}",
                bio, location, websiteLink, birthdate);

        Profile updatedProfile = new Profile(
                this.profile.getUserId(),
                bio,
                location,
                websiteLink,
                birthdate,
                this.profile.getJoinedAt()
        );
        this.profile = updatedProfile;
    }

}
