package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.request.create.VoteCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.VoteResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Vote;

@Mapper(config = BaseMapper.class)
public interface VoteMapper extends BaseMapper<Vote, VoteCreateDTO, VoteResponseDTO> {
}
