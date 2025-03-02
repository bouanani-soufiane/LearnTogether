package yc.ma.LearnTogether.content.application.mapper;

import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.content.application.dto.request.create.TagCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.TagResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Tag;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class TagMapperImpl implements TagMapper {

    @Override
    public TagResponseDTO toResponseDto(Tag entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String name = null;

        id = entity.getId();
        name = entity.getName();

        TagResponseDTO tagResponseDTO = new TagResponseDTO( id, name );

        return tagResponseDTO;
    }

    @Override
    public Tag toEntity(TagCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Tag tag = new Tag();

        return tag;
    }

    @Override
    public Set<TagResponseDTO> toResponseDtoSet(Set<Tag> tags) {
        if ( tags == null ) {
            return null;
        }

        Set<TagResponseDTO> set = LinkedHashSet.newLinkedHashSet( tags.size() );
        for ( Tag tag : tags ) {
            set.add( toResponseDto( tag ) );
        }

        return set;
    }
}
