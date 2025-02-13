package yc.ma.LearnTogether.user.domain.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
@Table(name = "users", schema = "youcoder")
public class User {
    @Id
    @With
    private final Long id;

    @Column("full_name")
    private String fullName;

    private String email;
    private String password;
    private UserStatus status;
    private UserRole role;
    @MappedCollection(idColumn = "user_id")
    private Profile profile;
}