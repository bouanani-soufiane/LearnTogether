package yc.ma.LearnTogether.content.domain.service;

import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.common.application.service.CrudService;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.update.QuestionUpdateDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;

public interface QuestionService  extends CrudService<Long , QuestionCreateDTO , QuestionUpdateDTO, QuestionResponseDTO> {

    QuestionResponseDTO  create ( QuestionCreateDTO dto , Long id);

    PagedResult<QuestionResponseDTO> findQuestions ( int pageNo , int pageSize);
}
