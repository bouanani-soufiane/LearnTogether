package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.application.dto.response.CommentResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Blog;
import yc.ma.LearnTogether.content.domain.model.Comment;

@Mapper(config = BaseMapper.class)

public interface BlogMapper extends BaseMapper<Blog, CreateBlogRequest, BlogResponseDTO> {
    @Mapping(target = "commentCount", expression = "java(blog.getCommentCount())")
    BlogSummaryDTO toSummaryDto(Blog blog);

    @Mapping(target = "commentCount", expression = "java(blog.getCommentCount())")
    BlogResponseDTO toResponseDto(Blog blog);

    CommentResponseDTO toCommentResponseDto(Comment comment);

}
