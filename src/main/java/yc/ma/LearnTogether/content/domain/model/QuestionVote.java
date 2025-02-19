package yc.ma.LearnTogether.content.domain.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "votes" , schema = "content")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE , onConstructor_ = @PersistenceCreator)
public class QuestionVote {

    private @Id @With long id;

    private long userId;

    private long questionId;

    private long answerId;

    private long value;

}
