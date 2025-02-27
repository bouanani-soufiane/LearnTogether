package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import yc.ma.LearnTogether.content.domain.model.Tag;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface TagRepository extends CrudRepository<Tag, Long> {

    Optional<Tag> findByName(String name);

    List<Tag> findAllByOrderByNameAsc();

    @Query("SELECT t.* FROM content.tags t " +
            "JOIN content.blog_tags bt ON t.id = bt.tag_id " +
            "WHERE bt.blog_id = :blogId")
    Set<Tag> findByBlogId(@Param("blogId") Long blogId);

    @Query("SELECT t.* FROM content.tags t " +
            "JOIN content.question_tags qt ON t.id = qt.tag_id " +
            "WHERE qt.question_id = :questionId")
    Set<Tag> findByQuestionId(@Param("questionId") Long questionId);

    @Query("SELECT t.* FROM content.tags t " +
            "WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "ORDER BY t.name ASC LIMIT :limit")
    List<Tag> searchTags(@Param("query") String query, @Param("limit") int limit);
}