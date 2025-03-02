package yc.ma.LearnTogether.content.application.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.content.application.dto.response.CommentResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Comment;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class CommentMapperImpl implements CommentMapper {

    @Override
    public Object toEntity(Object dto) {
        if ( dto == null ) {
            return null;
        }

        Object object = new Object();

        return object;
    }

    @Override
    public Object toResponseDto(Object entity) {
        if ( entity == null ) {
            return null;
        }

        Object object = new Object();

        return object;
    }

    @Override
    public CommentResponseDTO toResponseDto(Comment comment) {
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
}
