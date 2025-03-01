package yc.ma.LearnTogether.user.application.mapper;

import org.mapstruct.Mapper;
import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.user.application.dto.request.create.ProfileCreateDTO;
import yc.ma.LearnTogether.user.application.dto.response.ProfileResponseDTO;
import yc.ma.LearnTogether.user.domain.model.Profile;

@Mapper(config = BaseMapper.class)

public interface ProfileMapper extends BaseMapper<Profile, ProfileCreateDTO, ProfileResponseDTO> {
}
