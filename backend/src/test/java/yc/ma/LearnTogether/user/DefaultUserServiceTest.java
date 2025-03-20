package yc.ma.LearnTogether.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.common.domain.exception.NotFoundException;
import yc.ma.LearnTogether.user.application.dto.request.create.ProfileCreateDTO;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.request.update.UserUpdateDTO;
import yc.ma.LearnTogether.user.application.dto.response.ProfileResponseDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.application.mapper.ProfileMapper;
import yc.ma.LearnTogether.user.application.mapper.UserMapper;
import yc.ma.LearnTogether.user.domain.exception.BadRequestException;
import yc.ma.LearnTogether.user.domain.model.Profile;
import yc.ma.LearnTogether.user.domain.model.User;
import yc.ma.LearnTogether.user.domain.model.UserRole;
import yc.ma.LearnTogether.user.domain.model.UserStatus;
import yc.ma.LearnTogether.user.domain.repository.UserRepository;
import yc.ma.LearnTogether.user.domain.service.impl.DefaultUserService;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DefaultUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private ProfileMapper profileMapper;

    @InjectMocks
    private DefaultUserService userService;

    private User user;
    private UserResponseDTO userResponseDTO;
    private UserRequestDTO userRequestDTO;
    private ProfileCreateDTO profileCreateDTO;
    private UserUpdateDTO userUpdateDTO;
    private Profile profile;

    @BeforeEach
    void setUp() {
        // Setup test data
        profile = new Profile(1L, "Bio", "Location", "website.com", LocalDate.of(1990, 1, 1), Instant.now());
        user = new User(1L, "John Doe", "john@example.com", "password", UserStatus.ACTIVE, UserRole.STUDENT, profile);

        ProfileResponseDTO profileResponseDTO = new ProfileResponseDTO(1L, "Bio", "Location", "website.com", LocalDate.of(1990, 1, 1), Instant.now());
        userResponseDTO = new UserResponseDTO(1L, "John Doe", "john@example.com",  UserStatus.ACTIVE, UserRole.STUDENT, profileResponseDTO);

        userRequestDTO = new UserRequestDTO("John Doe", "john@example.com", "password", UserRole.STUDENT);

        profileCreateDTO = new ProfileCreateDTO("Updated Bio", "Updated Location", "updated-website.com", LocalDate.of(1991, 1, 1));

        userUpdateDTO = new UserUpdateDTO("Updated Name", "updated@example.com", "newpassword");
    }

    @Test
    void findUsers_ShouldReturnPagedUsers() {
        // Arrange
        List<User> users = Collections.singletonList(user);
        Page<User> page = new PageImpl<>(users);
        when(userRepository.findAll(any(Pageable.class))).thenReturn(page);
        when(userMapper.toResponseDto(user)).thenReturn(userResponseDTO);

        // Act
        PagedResult<UserResponseDTO> result = userService.findUsers(1, 10);

        // Assert
        assertNotNull(result);
//        assertEquals(1, result.getPage().getTotalElements());
//        assertEquals(userResponseDTO, result.getPage().getContent().get(0));
        verify(userRepository).findAll(any(Pageable.class));
    }

    @Test
    void findById_WithExistingId_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponseDto(user)).thenReturn(userResponseDTO);

        // Act
        UserResponseDTO result = userService.findById(1L);

        // Assert
        assertEquals(userResponseDTO, result);
        verify(userRepository).findById(1L);
    }

    @Test
    void findById_WithNonExistingId_ShouldThrowNotFoundException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> userService.findById(1L));
        verify(userRepository).findById(1L);
    }

    @Test
    void create_WithValidData_ShouldCreateUser() {
        // Arrange
        when(userRepository.findByEmail(userRequestDTO.email())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponseDto(user)).thenReturn(userResponseDTO);

        // Act
        UserResponseDTO result = userService.create(userRequestDTO);

        // Assert
        assertEquals(userResponseDTO, result);
        verify(userRepository).findByEmail(userRequestDTO.email());
        verify(userRepository, atLeastOnce()).save(any(User.class));
    }

    @Test
    void create_WithExistingEmail_ShouldThrowBadRequestException() {
        // Arrange
        when(userRepository.findByEmail(userRequestDTO.email())).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(BadRequestException.class, () -> userService.create(userRequestDTO));
        verify(userRepository).findByEmail(userRequestDTO.email());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserProfile_WithValidData_ShouldUpdateProfile() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponseDto(user)).thenReturn(userResponseDTO);

        // Act
        UserResponseDTO result = userService.updateUserProfile(1L, profileCreateDTO);

        // Assert
        assertEquals(userResponseDTO, result);
        verify(userRepository).findById(1L);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void update_WithValidData_ShouldUpdateUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponseDto(user)).thenReturn(userResponseDTO);

        // Act
        UserResponseDTO result = userService.update(1L, userUpdateDTO);

        // Assert
        assertEquals(userResponseDTO, result);
        verify(userRepository).findById(1L);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void delete_WithExistingId_ShouldDeleteUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(user);

        // Act
        userService.delete(1L);

        // Assert
        verify(userRepository).findById(1L);
        verify(userRepository).delete(user);
    }

    @Test
    void delete_WithNonExistingId_ShouldThrowNotFoundException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> userService.delete(1L));
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    void findAll_ShouldReturnPagedUsers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> page = new PageImpl<>(Collections.singletonList(user));
        when(userRepository.findAll(pageable)).thenReturn(page);
        when(userMapper.toResponseDto(user)).thenReturn(userResponseDTO);

        // Act
        Page<UserResponseDTO> result = userService.findAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(userResponseDTO, result.getContent().get(0));
        verify(userRepository).findAll(pageable);
    }
}