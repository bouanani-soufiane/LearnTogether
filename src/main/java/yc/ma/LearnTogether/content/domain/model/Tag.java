package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "tags", schema = "content")
@NoArgsConstructor
@ToString
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Tag {

    @Id
    @With
    private Long id;

    private String name;

    public static Tag create(String name) {
        return new Tag(null, name.trim().toLowerCase());
    }

    public void updateName(String name) {
        this.name = name.trim().toLowerCase();
    }
}