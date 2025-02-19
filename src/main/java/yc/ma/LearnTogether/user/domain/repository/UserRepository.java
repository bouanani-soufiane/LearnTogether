package yc.ma.LearnTogether.user.domain.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import yc.ma.LearnTogether.user.domain.model.User;

public interface UserRepository extends CrudRepository<User, Long>, PagingAndSortingRepository<User, Long> {
}
