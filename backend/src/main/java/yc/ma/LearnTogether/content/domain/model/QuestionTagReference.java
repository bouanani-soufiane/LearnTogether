package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "question_tags", schema = "content")
@NoArgsConstructor
@Getter
@EqualsAndHashCode(of = {"questionId", "tagId"})
public class QuestionTagReference {

    @Id
    private Long id;

    private Long questionId;
    private Long tagId;

    public QuestionTagReference(Long id, Long questionId, Long tagId) {
        this.id = id;
        this.questionId = questionId;
        this.tagId = tagId;
    }

    public static QuestionTagReference create(Long questionId, Long tagId) {
        return new QuestionTagReference(null, questionId, tagId);
    }
}