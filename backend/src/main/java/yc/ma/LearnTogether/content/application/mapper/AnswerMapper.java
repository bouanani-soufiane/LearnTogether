package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.request.create.AnswerCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.AnswerResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Answer;

@Mapper(config = BaseMapper.class)
public interface AnswerMapper extends BaseMapper<Answer, AnswerCreateDTO, AnswerResponseDTO> {
}
