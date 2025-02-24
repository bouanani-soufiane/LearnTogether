package yc.ma.LearnTogether.user.domain.service;

import org.springframework.security.core.Authentication;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.response.JwtResponseDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;

public interface AuthService {
    JwtResponseDTO generateJwtToken(Authentication authentication);
    UserResponseDTO register(UserRequestDTO registerRequest);
}