package yc.ma.LearnTogether.content.application.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.content.application.dto.request.create.VoteCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.VoteResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Vote;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class VoteMapperImpl implements VoteMapper {

    @Override
    public Vote toEntity(VoteCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Vote vote = new Vote();

        return vote;
    }

    @Override
    public VoteResponseDTO toResponseDto(Vote entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        Integer value = null;

        id = entity.getId();
        userId = entity.getUserId();
        value = entity.getValue();

        VoteResponseDTO voteResponseDTO = new VoteResponseDTO( id, userId, value );

        return voteResponseDTO;
    }
}
