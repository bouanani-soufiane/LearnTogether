package yc.ma.LearnTogether.content.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import yc.ma.LearnTogether.content.domain.model.Blog;

public interface BlogRepository extends CrudRepository<Blog, Long>, PagingAndSortingRepository<Blog, Long> {

    Page<Blog> findByUserId ( Long userId, Pageable pageable );


}
