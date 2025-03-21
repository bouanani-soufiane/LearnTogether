package yc.ma.LearnTogether.user;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.response.JwtResponseDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.domain.model.UserRole;
import yc.ma.LearnTogether.user.domain.model.UserStatus;
import yc.ma.LearnTogether.user.domain.service.UserService;
import yc.ma.LearnTogether.user.domain.service.impl.DefaultAuthService;
import yc.ma.LearnTogether.user.infrastructure.jwt.JwtTokenProvider;
import yc.ma.LearnTogether.user.infrastructure.userdetails.UserDetailsImpl;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class DefaultAuthServiceTest {

    private JwtTokenProvider tokenProvider;
    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private DefaultAuthService authService;

    private Authentication authentication;
    private UserDetailsImpl userDetails;
    private UserRequestDTO userRequestDTO;
    private UserResponseDTO userResponseDTO;
    private String encodedPassword;
    private ArgumentCaptor<UserRequestDTO> userRequestCaptor;

    @Before
    public void setUp () {
        // Create mocks manually
        tokenProvider = Mockito.mock(JwtTokenProvider.class);
        userService = Mockito.mock(UserService.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        userRequestCaptor = ArgumentCaptor.forClass(UserRequestDTO.class);

        authService = new DefaultAuthService(tokenProvider, userService, passwordEncoder);

        userDetails = new UserDetailsImpl(
                1L,
                "john@example.com",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT")),
                true
        );

        authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        userRequestDTO = new UserRequestDTO("John Doe", "john@example.com", "password", UserRole.STUDENT);

        userResponseDTO = new UserResponseDTO(1L, "John Doe", "john@example.com",
                UserStatus.ACTIVE, UserRole.STUDENT, null);

        encodedPassword = "encodedPassword";
    }

    @Test
    public void generateJwtToken_ShouldReturnJwtResponse () {
        // Arrange
        String token = "jwt-token";
        when(tokenProvider.generateToken(authentication)).thenReturn(token);

        JwtResponseDTO response = authService.generateJwtToken(authentication);

        assertNotNull(response);
        assertEquals(token, response.token());
        assertEquals("Bearer", response.type());
        assertEquals("john@example.com", response.email());
        assertEquals("ROLE_STUDENT", response.role());
        verify(tokenProvider).generateToken(authentication);
    }

    @Test
    public void register_ShouldEncodePasswordAndRegisterUser () {
        when(passwordEncoder.encode(userRequestDTO.password())).thenReturn(encodedPassword);
        when(userService.create(any(UserRequestDTO.class))).thenReturn(userResponseDTO);

        UserResponseDTO response = authService.register(userRequestDTO);

        assertNotNull(response);
        assertEquals(userResponseDTO, response);
        verify(passwordEncoder).encode(userRequestDTO.password());
        verify(userService).create(userRequestCaptor.capture());

        UserRequestDTO capturedRequest = userRequestCaptor.getValue();
        assertEquals(userRequestDTO.fullName(), capturedRequest.fullName());
        assertEquals(userRequestDTO.email(), capturedRequest.email());
        assertEquals(encodedPassword, capturedRequest.password());
        assertEquals(userRequestDTO.role(), capturedRequest.role());
    }
}