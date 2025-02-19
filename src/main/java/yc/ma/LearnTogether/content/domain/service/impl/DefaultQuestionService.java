package yc.ma.LearnTogether.content.domain.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jdbc.core.mapping.AggregateReference;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.content.application.dto.request.create.QuestionCreateDTO;
import yc.ma.LearnTogether.content.application.dto.request.update.QuestionUpdateDTO;
import yc.ma.LearnTogether.content.application.dto.response.QuestionResponseDTO;
import yc.ma.LearnTogether.content.application.mapper.QuestionMapper;
import yc.ma.LearnTogether.content.domain.model.Question;
import yc.ma.LearnTogether.content.domain.repository.QuestionRepository;
import yc.ma.LearnTogether.content.domain.service.QuestionService;

import java.util.HashSet;


@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultQuestionService implements QuestionService {
    private final QuestionRepository repository;
    private final QuestionMapper mapper;


    @Override
    @Transactional
    public QuestionResponseDTO create ( QuestionCreateDTO dto , Long id) {
        Question question = Question.create(dto.title() , dto.content() ,id);
        System.out.println(
                "here : "+
                        question
        );
        return mapper.toResponseDto(repository.save(question));
    }

    @Override
    public Page<QuestionResponseDTO> findAll ( Pageable pageable ) {
        return null;
    }

    @Override
    public QuestionResponseDTO findById ( Long aLong ) {
        return null;
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



}
