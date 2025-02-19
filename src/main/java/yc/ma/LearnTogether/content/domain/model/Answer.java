package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.annotation.Transient;
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

    @Embedded.Nullable
    private AIValidationStatus aiValidationStatus;

    @Embedded.Nullable
    private AnswerVote answerVote;

//    @Transient
//    @Setter
//    private Question question;
}
