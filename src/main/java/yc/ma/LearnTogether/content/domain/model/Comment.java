package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

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
    private Long blogId;

    public static Comment create(Long userId, String content, Long blogId) {
        Comment comment = new Comment();
        comment.userId = userId;
        comment.content = content;
        comment.blogId = blogId;
        return comment;
    }
}