package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.response.CommentResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Comment;

@Mapper(config = BaseMapper.class)
public interface CommentMapper extends BaseMapper {
    CommentResponseDTO toResponseDto(Comment comment);
}