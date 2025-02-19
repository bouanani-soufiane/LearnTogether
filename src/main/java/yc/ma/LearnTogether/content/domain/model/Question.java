package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Table(name = "questions", schema = "content")
@NoArgsConstructor
@ToString
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Question {
    private @Id
    @With Long id;
    private Long userId;
    private String title;
    private String content;

    @MappedCollection(idColumn = "question_id")
    private Set<Answer> answers = new HashSet<>();

    @MappedCollection(idColumn = "question_id")
    private Set<Vote> votes = new HashSet<>();

    public static Question create ( String title, String content, Long userId ) {
        Question question = new Question();
        question.title = title;
        question.content = content;
        question.userId = userId;
        return question;
    }
    public void addAnswer(Answer answer) {
        answers.add(answer);
    }

}
