package yc.ma.LearnTogether.content.domain.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.content.domain.repository.QuestionRepository;
import yc.ma.LearnTogether.content.domain.service.QuestionService;


@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultQuestionService implements QuestionService {
    private final QuestionRepository repository;

}
