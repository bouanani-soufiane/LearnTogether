package yc.ma.LearnTogether.content.application.mapper;

import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.AnswerResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.TagResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.VoteResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Answer;
import yc.ma.LearnTogether.content.domain.model.Question;
import yc.ma.LearnTogether.content.domain.model.Tag;
import yc.ma.LearnTogether.content.domain.model.Vote;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class QuestionMapperImpl implements QuestionMapper {

    @Override
    public Question toEntity(QuestionCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Question question = new Question();

        return question;
    }

    @Override
    public QuestionResponseDTO toResponseDto(Question entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        String title = null;
        String content = null;
        Set<AnswerResponseDTO> answers = null;
        Set<VoteResponseDTO> votes = null;
        Set<TagResponseDTO> tags = null;

        id = entity.getId();
        userId = entity.getUserId();
        title = entity.getTitle();
        content = entity.getContent();
        answers = answerSetToAnswerResponseDTOSet( entity.getAnswers() );
        votes = voteSetToVoteResponseDTOSet( entity.getVotes() );
        tags = tagSetToTagResponseDTOSet( entity.getTags() );

        QuestionResponseDTO questionResponseDTO = new QuestionResponseDTO( id, userId, title, content, answers, votes, tags );

        return questionResponseDTO;
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

    protected AnswerResponseDTO answerToAnswerResponseDTO(Answer answer) {
        if ( answer == null ) {
            return null;
        }

        Long id = null;
        Long userId = null;
        String content = null;
        boolean valid = false;
        Set<VoteResponseDTO> votes = null;

        id = answer.getId();
        userId = answer.getUserId();
        content = answer.getContent();
        valid = answer.isValid();
        votes = voteSetToVoteResponseDTOSet( answer.getVotes() );

        AnswerResponseDTO answerResponseDTO = new AnswerResponseDTO( id, userId, content, valid, votes );

        return answerResponseDTO;
    }

    protected Set<AnswerResponseDTO> answerSetToAnswerResponseDTOSet(Set<Answer> set) {
        if ( set == null ) {
            return null;
        }

        Set<AnswerResponseDTO> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Answer answer : set ) {
            set1.add( answerToAnswerResponseDTO( answer ) );
        }

        return set1;
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
}
