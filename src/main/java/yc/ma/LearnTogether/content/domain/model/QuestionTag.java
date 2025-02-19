package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "question_tags", schema = "content")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class QuestionTag {
    private Long questionId;
    private Long tagId;
}
