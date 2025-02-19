package yc.ma.LearnTogether.content.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;
import yc.ma.LearnTogether.content.domain.model.Question;

@Mapper(config = BaseMapper.class)
public interface QuestionMapper extends BaseMapper<Question, QuestionCreateDTO, QuestionResponseDTO> {

}
