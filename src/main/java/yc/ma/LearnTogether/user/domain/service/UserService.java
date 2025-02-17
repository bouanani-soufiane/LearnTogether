package yc.ma.LearnTogether.user.domain.service;

import yc.ma.LearnTogether.common.application.service.CrudService;
import yc.ma.LearnTogether.user.application.dto.request.create.ProfileCreateDTO;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.request.update.UserUpdateDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;

public interface UserService extends CrudService<Long, UserRequestDTO, UserUpdateDTO, UserResponseDTO> {

    UserResponseDTO updateUserProfile ( Long userId, ProfileCreateDTO profile );
}
