package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

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
        if (questionId == null) {
            throw new IllegalArgumentException("Question id must not be null for a question vote");
        }
        return new Vote(null, userId, questionId, null, value);
    }


    public static Vote forAnswer(Long userId, Long answerId, int value) {
        if (answerId == null) {
            throw new IllegalArgumentException("Answer id must not be null for an answer vote");
        }
        return new Vote(null, userId, null, answerId, value);
    }

}
