package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "comments", schema = "content")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
@NoArgsConstructor
@ToString
public class Comment {
    @Id
    private Long id;
    private Long userId;
    private String content;
    private CommentReferenceType referenceType;
    private Long referenceId;
}
