package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.data.relational.core.mapping.Embedded;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;
import yc.ma.LearnTogether.user.domain.model.User;

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
    private @Id @With Long id;
    private Long userId;
    private String title;
    private String content;

    @MappedCollection(idColumn = "question_id")
    private Set<Answer> answers = new HashSet<>();

    @MappedCollection(idColumn = "question_id")
    private List<QuestionVote> questionVote = new ArrayList<>();



    public static Question create(String title , String content ,Long userId ){
        Question question = new Question();
        question.title = title;
        question.content = content;
        question.userId = userId;
        return question;
    }




}
