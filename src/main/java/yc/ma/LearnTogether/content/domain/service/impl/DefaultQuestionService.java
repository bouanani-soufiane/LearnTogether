package yc.ma.LearnTogether.content.domain.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.common.domain.exception.NotFoundException;
import yc.ma.LearnTogether.content.application.dto.request.create.AnswerCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.create.VoteCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.update.QuestionUpdateDTO;
import yc.ma.LearnTogether.content.application.dto.response.AnswerResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;
import yc.ma.LearnTogether.content.application.dto.response.VoteResponseDTO;
import yc.ma.LearnTogether.content.application.mapper.AnswerMapper;
import yc.ma.LearnTogether.content.application.mapper.QuestionMapper;
import yc.ma.LearnTogether.content.application.mapper.VoteMapper;
import yc.ma.LearnTogether.content.domain.model.Answer;
import yc.ma.LearnTogether.content.domain.model.Question;
import yc.ma.LearnTogether.content.domain.model.Vote;
import yc.ma.LearnTogether.content.domain.repository.QuestionRepository;
import yc.ma.LearnTogether.content.domain.service.QuestionService;


@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultQuestionService implements QuestionService {
    private final QuestionRepository repository;
    private final QuestionMapper questionMapper;
    private final AnswerMapper answerMapper;
    private final VoteMapper voteMapper;



    @Override
    public PagedResult<QuestionResponseDTO> findQuestions ( int pageNo, int pageSize ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo > 0 ? pageNo - 1 : 0, pageSize, sort);
        return new PagedResult<>(repository.findAll(pageable).map(questionMapper::toResponseDto));
    }

    @Override
    @Transactional
    public QuestionResponseDTO create ( QuestionCreateDTO dto, Long id ) {
        Question question = Question.create(dto.title(), dto.content(), id);

        return questionMapper.toResponseDto(repository.save(question));
    }

    @Override
    @Transactional
    public AnswerResponseDTO addAnswer ( Long questionId, AnswerCreateDTO answerDto ) {
        Question question = findQuestionById(questionId);
        Answer answer = Answer.create(answerDto.userId(), answerDto.content());
        question.addAnswer(answer);
        repository.save(question);

        return answerMapper.toResponseDto(answer);
    }

    @Override
    @Transactional
    public VoteResponseDTO addVoteToQuestion( Long questionId, VoteCreateDTO voteDto) {
        Question question = findQuestionById(questionId);

        Vote vote = Vote.forQuestion(voteDto.userId(), questionId, voteDto.value());

        question.getVotes().add(vote);

        Question savedQuestion = repository.save(question);

        Vote savedVote = savedQuestion.getVotes().stream()
                .filter(v -> v.getUserId().equals(voteDto.userId()) && v.getValue() == voteDto.value())
                .findFirst()
                .orElse(vote);

        return voteMapper.toResponseDto(savedVote);
    }












    @Override
    public Page<QuestionResponseDTO> findAll ( Pageable pageable ) {
        return null;
    }

    @Override
    public QuestionResponseDTO findById ( Long id ) {
        return questionMapper.toResponseDto(findQuestionById(id));
    }


    @Override
    public QuestionResponseDTO create ( QuestionCreateDTO questionCreateDTO ) {
        return null;
    }


    @Override
    public QuestionResponseDTO update ( Long aLong, QuestionUpdateDTO questionUpdateDTO ) {
        return null;
    }

    @Override
    public void delete ( Long aLong ) {

    }

    private Question findQuestionById ( Long id ) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Question", id));
    }
}
