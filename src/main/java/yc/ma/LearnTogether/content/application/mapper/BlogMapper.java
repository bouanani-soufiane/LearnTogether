package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.request.create.CreateBlogRequest;
import yc.ma.LearnTogether.content.application.dto.response.BlogResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.BlogSummaryDTO;
import yc.ma.LearnTogether.content.domain.model.Blog;

@Mapper(config = BaseMapper.class)

public interface BlogMapper extends BaseMapper<Blog, CreateBlogRequest, BlogResponseDTO> {
    BlogSummaryDTO toSummaryDto( Blog blog);
}
