package yc.ma.LearnTogether.content.application.mapper;

import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.content.application.dto.request.create.AnswerCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.AnswerResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.VoteResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Answer;
import yc.ma.LearnTogether.content.domain.model.Vote;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class AnswerMapperImpl implements AnswerMapper {

    @Override
    public Answer toEntity(AnswerCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Answer answer = new Answer();

        return answer;
    }

    @Override
    public AnswerResponseDTO toResponseDto(Answer entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        String content = null;
        boolean valid = false;
        Set<VoteResponseDTO> votes = null;

        id = entity.getId();
        userId = entity.getUserId();
        content = entity.getContent();
        valid = entity.isValid();
        votes = voteSetToVoteResponseDTOSet( entity.getVotes() );

        AnswerResponseDTO answerResponseDTO = new AnswerResponseDTO( id, userId, content, valid, votes );

        return answerResponseDTO;
    }

    protected VoteResponseDTO voteToVoteResponseDTO(Vote vote) {
        if ( vote == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        Integer value = null;

        id = vote.getId();
        userId = vote.getUserId();
        value = vote.getValue();

        VoteResponseDTO voteResponseDTO = new VoteResponseDTO( id, userId, value );

        return voteResponseDTO;
    }

    protected Set<VoteResponseDTO> voteSetToVoteResponseDTOSet(Set<Vote> set) {
        if ( set == null ) {
            return null;
        }

        Set<VoteResponseDTO> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Vote vote : set ) {
            set1.add( voteToVoteResponseDTO( vote ) );
        }

        return set1;
    }
}
