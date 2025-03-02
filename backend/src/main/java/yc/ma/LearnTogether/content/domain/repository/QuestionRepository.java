package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import yc.ma.LearnTogether.content.domain.model.Question;

import java.util.Optional;

public interface QuestionRepository extends CrudRepository<Question, Long>, PagingAndSortingRepository<Question, Long> {

    @Query("SELECT q.* FROM content.questions q " +
            "JOIN content.answers a ON q.id = a.question_id " +
            "WHERE a.id = :answerId")
    Optional<Question> findByAnswersId(Long answerId);
}

