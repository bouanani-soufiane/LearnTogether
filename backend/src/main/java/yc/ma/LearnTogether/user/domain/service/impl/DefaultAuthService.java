package yc.ma.LearnTogether.user.domain.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.response.JwtResponseDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.domain.service.AuthService;
import yc.ma.LearnTogether.user.domain.service.UserService;
import yc.ma.LearnTogether.user.infrastructure.jwt.JwtTokenProvider;
import yc.ma.LearnTogether.user.infrastructure.userdetails.UserDetailsImpl;

@Service
@RequiredArgsConstructor
public class DefaultAuthService implements AuthService {

    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public JwtResponseDTO generateJwtToken(Authentication authentication) {
        String jwt = tokenProvider.generateToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponseDTO(
                jwt,
                "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getAuthorities().stream().findFirst().get().getAuthority()
        );
    }

    @Override
    public UserResponseDTO register(UserRequestDTO registerRequest) {
        UserRequestDTO userWithEncodedPassword = new UserRequestDTO(
                registerRequest.fullName(),
                registerRequest.email(),
                passwordEncoder.encode(registerRequest.password()),
                registerRequest.role()
        );

        return userService.create(userWithEncodedPassword);
    }
}