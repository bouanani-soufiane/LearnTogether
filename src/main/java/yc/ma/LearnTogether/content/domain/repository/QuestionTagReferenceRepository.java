package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.repository.CrudRepository;
import yc.ma.LearnTogether.content.domain.model.QuestionTagReference;

import java.util.Optional;

public interface QuestionTagReferenceRepository extends CrudRepository<QuestionTagReference, Long> {

    Optional<QuestionTagReference> findByQuestionIdAndTagId(Long questionId, Long tagId);

    void deleteAllByQuestionId(Long questionId);

    void deleteAllByTagId(Long tagId);
}