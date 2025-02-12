package yc.ma.LearnTogether.user.domain.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import yc.ma.LearnTogether.user.domain.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
}
