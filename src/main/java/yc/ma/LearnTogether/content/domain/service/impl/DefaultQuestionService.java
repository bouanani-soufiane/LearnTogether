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
        var pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, sort);
        return new PagedResult<>(repository.findAll(pageable).map(questionMapper::toResponseDto));
    }

    @Override
    @Transactional
    public QuestionResponseDTO create ( QuestionCreateDTO dto, Long userId ) {
        Question question = Question.create(dto.title(), dto.content(), userId);
        return questionMapper.toResponseDto(repository.save(question));
    }

    @Override
    @Transactional
    public AnswerResponseDTO addAnswer ( Long questionId, AnswerCreateDTO dto ) {
        Question question = findQuestionById(questionId);
        Answer answer = question.addAnswer(dto.userId(), dto.content());
        repository.save(question);
        return answerMapper.toResponseDto(answer);
    }

    @Override
    @Transactional
    public VoteResponseDTO addVoteToQuestion ( Long questionId, VoteCreateDTO dto ) {
        Question question = findQuestionById(questionId);
        Vote vote = question.addVoteToQuestion(dto.userId(), dto.value());
        repository.save(question);
        return voteMapper.toResponseDto(vote);
    }

    @Override
    @Transactional
    public VoteResponseDTO addVoteToAnswer ( Long answerId, VoteCreateDTO dto ) {
        Question question = repository.findByAnswersId(answerId)
                .orElseThrow(() -> new NotFoundException("Question containing answer", answerId));
        Vote vote = question.addVoteToAnswer(answerId, dto.userId(), dto.value());
        repository.save(question);
        return voteMapper.toResponseDto(vote);
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