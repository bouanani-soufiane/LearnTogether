package yc.ma.LearnTogether.user.application.mapper;

import java.time.Instant;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.response.ProfileResponseDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.domain.model.Profile;
import yc.ma.LearnTogether.user.domain.model.User;
import yc.ma.LearnTogether.user.domain.model.UserRole;
import yc.ma.LearnTogether.user.domain.model.UserStatus;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(UserRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        return user;
    }

    @Override
    public UserResponseDTO toResponseDto(User entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String fullName = null;
        String email = null;
        String password = null;
        UserStatus status = null;
        UserRole role = null;
        ProfileResponseDTO profile = null;

        id = entity.getId();
        fullName = entity.getFullName();
        email = entity.getEmail();
        password = entity.getPassword();
        status = entity.getStatus();
        role = entity.getRole();
        profile = profileToProfileResponseDTO( entity.getProfile() );

        UserResponseDTO userResponseDTO = new UserResponseDTO( id, fullName, email, password, status, role, profile );

        return userResponseDTO;
    }

    protected ProfileResponseDTO profileToProfileResponseDTO(Profile profile) {
        if ( profile == null ) {
            return null;
        }

        Long userId = null;
        String bio = null;
        String location = null;
        String websiteLink = null;
        LocalDate birthdate = null;
        Instant joinedAt = null;

        userId = profile.getUserId();
        bio = profile.getBio();
        location = profile.getLocation();
        websiteLink = profile.getWebsiteLink();
        birthdate = profile.getBirthdate();
        joinedAt = profile.getJoinedAt();

        ProfileResponseDTO profileResponseDTO = new ProfileResponseDTO( userId, bio, location, websiteLink, birthdate, joinedAt );

        return profileResponseDTO;
    }
}
