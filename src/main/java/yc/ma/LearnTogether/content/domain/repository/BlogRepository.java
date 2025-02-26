package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import yc.ma.LearnTogether.content.domain.model.Blog;
import yc.ma.LearnTogether.content.domain.model.ReviewStatus;

import java.util.List;

public interface BlogRepository extends CrudRepository<Blog, Long>, PagingAndSortingRepository<Blog, Long> {

    Page<Blog> findByUserId(Long userId, Pageable pageable);
    Page<Blog> findByReviewStatus( ReviewStatus status, Pageable pageable);
    List<Blog> findTop5ByOrderByViewsDesc();

}
