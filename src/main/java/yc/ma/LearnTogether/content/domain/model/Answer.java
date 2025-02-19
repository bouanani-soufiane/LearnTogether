package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Embedded;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "answers", schema = "content")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Answer {
    @Id
    private Long id;
    private Long userId;
    private Long questionId;
    private String content;

    // Wrap validation status as a value object (record)
    @Embedded.Nullable
    private AIValidationStatus aiValidationStatus;

    // Embedded value object for the answer's vote summary
    @Embedded.Nullable
    private AnswerVote answerVote;
}
