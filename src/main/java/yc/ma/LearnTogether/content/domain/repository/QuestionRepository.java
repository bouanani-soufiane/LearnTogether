package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import yc.ma.LearnTogether.content.domain.model.Question;

public interface QuestionRepository extends CrudRepository<Question, Long>, PagingAndSortingRepository<Question, Long> {
}
