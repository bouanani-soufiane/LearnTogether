package yc.ma.LearnTogether.user.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "users", schema = "youcoder")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
@NoArgsConstructor()
@ToString
public class User {

    @Id
    @With
    private Long id;

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


    public void updateProfile(Profile profile) {
        this.profile.update(profile);
    }

}
