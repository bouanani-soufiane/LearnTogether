package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

import java.util.Objects;

@Table(name = "votes", schema = "content")
@Getter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Vote {
    @Id
    private Long id;
    private Long userId;
    private Long questionId;
    private Long answerId;
    private int value;

    public static Vote forQuestion(Long userId, Long questionId, int value) {
        Objects.requireNonNull(questionId, "Question ID must not be null");
        return new Vote(null, userId, questionId, null, value);
    }

    public static Vote forAnswer(Long userId, Long answerId, int value) {
        Objects.requireNonNull(answerId, "Answer ID must not be null");
        return new Vote(null, userId, null, answerId, value);
    }
}