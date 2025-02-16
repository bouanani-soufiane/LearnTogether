package yc.ma.LearnTogether.user.application.mapper;

import yc.ma.LearnTogether.common.application.mapper.BaseMapper;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.domain.model.User;
import org.mapstruct.Mapper;

@Mapper(config = BaseMapper.class)
public interface UserMapper extends BaseMapper<User, UserRequestDTO, UserResponseDTO> {
}
