package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Embedded;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.util.Set;

@Table(name = "blogs", schema = "content")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Blog {
    @Id
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private Integer views;

    // Wrap review status as a value object (record)
    @Embedded.Nullable
    private ReviewStatus reviewStatus;

    private LocalDate reviewedAt;

    // A blog may have many likes
    @MappedCollection(idColumn = "blog_id")
    private Set<Like> likes;
}
