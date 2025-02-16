package yc.ma.LearnTogether.user.application.service;

import yc.ma.LearnTogether.common.application.service.CrudService;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.request.update.UserUpdateDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.domain.model.User;

public interface UserService extends CrudService<Long, UserRequestDTO, UserUpdateDTO, UserResponseDTO> {
    User findUserById (Long id);
}
