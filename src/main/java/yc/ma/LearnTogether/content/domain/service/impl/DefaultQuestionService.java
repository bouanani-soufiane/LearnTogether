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
import yc.ma.LearnTogether.content.domain.model.Tag;
import yc.ma.LearnTogether.content.domain.model.Vote;
import yc.ma.LearnTogether.content.domain.repository.QuestionRepository;
import yc.ma.LearnTogether.content.domain.repository.TagRepository;
import yc.ma.LearnTogether.content.domain.service.QuestionService;
import yc.ma.LearnTogether.content.domain.service.TagService;

import java.util.Set;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultQuestionService implements QuestionService {
    private final QuestionRepository repository;
    private final TagRepository tagRepository;
    private final QuestionMapper questionMapper;
    private final AnswerMapper answerMapper;
    private final VoteMapper voteMapper;
    private final TagService tagService;

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
        Question savedQuestion = repository.save(question);

        if (dto.tagIds() != null && !dto.tagIds().isEmpty()) {
            tagService.addTagsToQuestion(savedQuestion.getId(), dto.tagIds());

            Set<Tag> tags = tagRepository.findByQuestionId(savedQuestion.getId());
            savedQuestion.setTags(tags);
        }

        return questionMapper.toResponseDto(savedQuestion);
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
        Question question = getQuestionByAnswerId(answerId);
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
        Question question = findQuestionById(id);
        return questionMapper.toResponseDto(question);
    }

    @Override
    public QuestionResponseDTO create ( QuestionCreateDTO questionCreateDTO ) {
        return null;
    }

    @Override
    @Transactional
    public QuestionResponseDTO update ( Long id, QuestionUpdateDTO updateDTO ) {
        Question question = findQuestionById(id);
        question.updateDetails(updateDTO.title(), updateDTO.content());

        if (updateDTO.tagIds() != null) {
            tagService.addTagsToQuestion(id, updateDTO.tagIds());
        }

        Question updatedQuestion = repository.save(question);

        Set<Tag> tags = tagRepository.findByQuestionId(updatedQuestion.getId());
        updatedQuestion.setTags(tags);

        return questionMapper.toResponseDto(updatedQuestion);
    }


    @Override
    @Transactional
    public void delete ( Long id ) {
        Question question = findQuestionById(id);
        repository.delete(question);
    }


    @Override
    @Transactional
    public AnswerResponseDTO markAnswerAsValid ( Long answerId ) {
        Question question = getQuestionByAnswerId(answerId);

        Answer answer = question.getAnswers().stream()
                .filter(a -> a.getId().equals(answerId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Answer", answerId));

        answer.markAsValid();
        repository.save(question);

        return answerMapper.toResponseDto(answer);
    }

    private Question getQuestionByAnswerId ( Long answerId ) {
        return repository.findByAnswersId(answerId)
                .orElseThrow(() -> new NotFoundException("Question containing answer", answerId));
    }


    private Question findQuestionById ( Long id ) {
        Question question = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Question", id));

        Set<Tag> tags = tagRepository.findByQuestionId(id);
        question.setTags(tags);

        return question;
    }


}