package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.relational.core.mapping.Column;
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
    private String content;

    @Column("is_valid")
    private boolean isValid;


    public static Answer create ( Long userId, String content ) {
        Answer answer = new Answer();
        answer.userId = userId;
        answer.content = content;
        answer.isValid = false;
        return answer;
    }
}
