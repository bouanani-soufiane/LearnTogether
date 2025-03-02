package yc.ma.LearnTogether.common.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.common.domain.exception.UnauthorizedException;
import yc.ma.LearnTogether.user.domain.repository.UserRepository;
import yc.ma.LearnTogether.user.infrastructure.userdetails.UserDetailsImpl;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public Long getCurrentUserId () {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetailsImpl) {
                return ((UserDetailsImpl) principal).getId();
            }
            else if (principal instanceof String) {
                String email = (String) principal;
                return userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedException("User not found with email: " + email)).getId();
            }
        }
        throw new UnauthorizedException("User not authenticated");
    }

    public UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetailsImpl) {
                return (UserDetailsImpl) principal;
            }
            else if (principal instanceof String) {
                String email = (String) principal;
                var user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new UnauthorizedException("User not found with email: " + email));
                return UserDetailsImpl.build(user);
            }
        }
        throw new UnauthorizedException("User not authenticated");
    }
}