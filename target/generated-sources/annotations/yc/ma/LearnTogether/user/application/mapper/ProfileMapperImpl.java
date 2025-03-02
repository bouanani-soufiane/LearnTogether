package yc.ma.LearnTogether.user.application.mapper;

import java.time.Instant;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.user.application.dto.request.create.ProfileCreateDTO;
import yc.ma.LearnTogether.user.application.dto.response.ProfileResponseDTO;
import yc.ma.LearnTogether.user.domain.model.Profile;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
@Component
public class ProfileMapperImpl implements ProfileMapper {

    @Override
    public Profile toEntity(ProfileCreateDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Profile profile = new Profile();

        return profile;
    }

    @Override
    public ProfileResponseDTO toResponseDto(Profile entity) {
        if ( entity == null ) {
            return null;
        }

        Long userId = null;
        String bio = null;
        String location = null;
        String websiteLink = null;
        LocalDate birthdate = null;
        Instant joinedAt = null;

        userId = entity.getUserId();
        bio = entity.getBio();
        location = entity.getLocation();
        websiteLink = entity.getWebsiteLink();
        birthdate = entity.getBirthdate();
        joinedAt = entity.getJoinedAt();

        ProfileResponseDTO profileResponseDTO = new ProfileResponseDTO( userId, bio, location, websiteLink, birthdate, joinedAt );

        return profileResponseDTO;
    }
}
