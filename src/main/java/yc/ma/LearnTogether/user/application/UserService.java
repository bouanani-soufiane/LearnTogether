package yc.ma.LearnTogether.user.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.user.domain.model.Profile;
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
    public User createUser(User user) {
        if (user.getProfile() == null) {
            Profile profile = new Profile();
            profile.setUserId(user.getId());
            user.setProfile(profile);
        }

        user = userRepository.save(user);
        return user;
    }


    public User updateUserProfile(Long userId, Profile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfile(profile);

        return userRepository.save(user);
    }
}
