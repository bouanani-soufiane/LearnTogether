package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.repository.CrudRepository;
import yc.ma.LearnTogether.content.domain.model.QuestionTagReference;

public interface QuestionTagReferenceRepository extends CrudRepository<QuestionTagReference, Long> {


    void deleteAllByTagId ( Long tagId );
}