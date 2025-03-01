package yc.ma.LearnTogether.content.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "blog_tags", schema = "content")
@NoArgsConstructor
@Getter
@EqualsAndHashCode(of = {"blogId", "tagId"})
public class BlogTagReference {

    @Id
    private Long id;

    private Long blogId;
    private Long tagId;

    public BlogTagReference(Long id, Long blogId, Long tagId) {
        this.id = id;
        this.blogId = blogId;
        this.tagId = tagId;
    }

    public static BlogTagReference create(Long blogId, Long tagId) {
        return new BlogTagReference(null, blogId, tagId);
    }
}