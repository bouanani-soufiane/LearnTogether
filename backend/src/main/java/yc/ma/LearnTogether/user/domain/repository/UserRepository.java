package yc.ma.LearnTogether.user.domain.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import yc.ma.LearnTogether.user.domain.model.User;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long>, PagingAndSortingRepository<User, Long> {
    Optional<User> findByEmail( String email);

}
