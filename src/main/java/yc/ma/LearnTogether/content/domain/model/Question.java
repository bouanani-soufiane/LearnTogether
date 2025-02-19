package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Embedded;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.util.Set;

@Table(name = "questions", schema = "content")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Question {
    @Id
    private Long id;
    private Long userId;
    private String title;
    private String content;

    // A Question may have many Answers (child entities)
    @MappedCollection(idColumn = "question_id")
    private Set<Answer> answers;

    // Embedded value object for the question's vote summary
    @Embedded.Nullable
    private QuestionVote questionVote;
}
