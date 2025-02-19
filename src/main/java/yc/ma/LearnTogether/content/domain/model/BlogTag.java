package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "blog_tags", schema = "content")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BlogTag {
    private Long blogId;
    private Long tagId;
}
