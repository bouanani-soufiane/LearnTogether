package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.request.create.TagCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.TagResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Tag;

import java.util.Set;

@Mapper(config = BaseMapper.class)
public interface TagMapper extends BaseMapper<Tag, TagCreateDTO, TagResponseDTO> {

    @Override
    @Mapping(target = "id", ignore = true)
    Tag toEntity(TagCreateDTO dto);

    Set<TagResponseDTO> toResponseDtoSet(Set<Tag> tags);
}