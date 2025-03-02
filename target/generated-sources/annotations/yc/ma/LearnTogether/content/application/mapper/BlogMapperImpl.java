package yc.ma.LearnTogether.content.application.mapper;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.application.dto.response.CommentResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.TagResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Blog;
import yc.ma.LearnTogether.content.domain.model.Comment;
import yc.ma.LearnTogether.content.domain.model.ReviewStatus;
import yc.ma.LearnTogether.content.domain.model.Tag;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class BlogMapperImpl implements BlogMapper {

    @Override
    public Blog toEntity(CreateBlogRequest dto) {
        if ( dto == null ) {
            return null;
        }

        Blog blog = new Blog();

        return blog;
    }

    @Override
    public BlogSummaryDTO toSummaryDto(Blog blog) {
        if ( blog == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        String title = null;
        Integer views = null;
        ReviewStatus reviewStatus = null;
        int likeCount = 0;
        Set<TagResponseDTO> tags = null;

        id = blog.getId();
        userId = blog.getUserId();
        title = blog.getTitle();
        views = blog.getViews();
        reviewStatus = blog.getReviewStatus();
        likeCount = blog.getLikeCount();
        tags = tagSetToTagResponseDTOSet( blog.getTags() );

        int commentCount = blog.getCommentCount();

        BlogSummaryDTO blogSummaryDTO = new BlogSummaryDTO( id, userId, title, views, reviewStatus, likeCount, tags, commentCount );

        return blogSummaryDTO;
    }

    @Override
    public BlogResponseDTO toResponseDto(Blog blog) {
        if ( blog == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        String title = null;
        String content = null;
        Integer views = null;
        ReviewStatus reviewStatus = null;
        LocalDate reviewedAt = null;
        int likeCount = 0;
        Set<CommentResponseDTO> comments = null;
        Set<TagResponseDTO> tags = null;

        id = blog.getId();
        userId = blog.getUserId();
        title = blog.getTitle();
        content = blog.getContent();
        views = blog.getViews();
        reviewStatus = blog.getReviewStatus();
        reviewedAt = blog.getReviewedAt();
        likeCount = blog.getLikeCount();
        comments = commentSetToCommentResponseDTOSet( blog.getComments() );
        tags = tagSetToTagResponseDTOSet( blog.getTags() );

        int commentCount = blog.getCommentCount();
        boolean likedByCurrentUser = false;

        BlogResponseDTO blogResponseDTO = new BlogResponseDTO( id, userId, title, content, views, reviewStatus, reviewedAt, likeCount, likedByCurrentUser, comments, tags, commentCount );

        return blogResponseDTO;
    }

    @Override
    public CommentResponseDTO toCommentResponseDto(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        String content = null;
        Long blogId = null;

        id = comment.getId();
        userId = comment.getUserId();
        content = comment.getContent();
        blogId = comment.getBlogId();

        CommentResponseDTO commentResponseDTO = new CommentResponseDTO( id, userId, content, blogId );

        return commentResponseDTO;
    }

    protected TagResponseDTO tagToTagResponseDTO(Tag tag) {
        if ( tag == null ) {
            return null;
        }

        Long id = null;
        String name = null;

        id = tag.getId();
        name = tag.getName();

        TagResponseDTO tagResponseDTO = new TagResponseDTO( id, name );

        return tagResponseDTO;
    }

    protected Set<TagResponseDTO> tagSetToTagResponseDTOSet(Set<Tag> set) {
        if ( set == null ) {
            return null;
        }

        Set<TagResponseDTO> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Tag tag : set ) {
            set1.add( tagToTagResponseDTO( tag ) );
        }

        return set1;
    }

    protected Set<CommentResponseDTO> commentSetToCommentResponseDTOSet(Set<Comment> set) {
        if ( set == null ) {
            return null;
        }

        Set<CommentResponseDTO> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Comment comment : set ) {
            set1.add( toCommentResponseDto( comment ) );
        }

        return set1;
    }
}
