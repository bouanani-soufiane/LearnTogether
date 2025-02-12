package yc.ma.LearnTogether.user.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.user.domain.model.User;
import yc.ma.LearnTogether.user.domain.repository.UserRepository;

@Service
@Transactional(readOnly = true)

public class UserService {

    private final UserRepository userRepository;

    public UserService ( UserRepository userRepository ) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser ( User user ) {

        return userRepository.save(user);
    }
}
