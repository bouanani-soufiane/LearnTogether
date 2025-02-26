package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.repository.CrudRepository;
import yc.ma.LearnTogether.content.domain.model.BlogTagReference;

import java.util.Optional;

public interface BlogTagReferenceRepository extends CrudRepository<BlogTagReference, Long> {

    Optional<BlogTagReference> findByBlogIdAndTagId(Long blogId, Long tagId);

    void deleteAllByBlogId(Long blogId);

    void deleteAllByTagId(Long tagId);
}