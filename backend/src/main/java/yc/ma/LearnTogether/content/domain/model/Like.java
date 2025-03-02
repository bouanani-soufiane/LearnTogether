package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table(name = "likes", schema = "content")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
@NoArgsConstructor
@ToString
public class Like {
    @Id
    private Long id;
    private Long userId;
    private Long blogId;
    private LocalDateTime likedAt;

    // Static factory method to create a new Like
    public static Like create(Long userId, Long blogId) {
        return new Like(null, userId, blogId, LocalDateTime.now());
    }
}