package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.data.relational.core.mapping.Embedded;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;
import yc.ma.LearnTogether.user.domain.model.User;

import java.util.Set;

@Table(name = "questions", schema = "content")
@NoArgsConstructor
@ToString
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class Question {
    @Id
    private Long id;
    private AggregateReference<User , Long> userId;
    private String title;
    private String content;

    @MappedCollection(idColumn = "question_id")
    private Set<Answer> answers;

    @Embedded.Nullable
    private QuestionVote questionVote;


    public static Question create(String title , String content ,AggregateReference<User , Long> userId ){
        Question question = new Question();
        question.title = title;
        question.content = content;
        question.userId = userId;
        return question;
    }


    public void addAnswer(Answer answer){
        answers.add(answer);
        answer.setQuestion(this);
    }

}
