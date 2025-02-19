package yc.ma.LearnTogether.user.domain.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.common.domain.exception.NotFoundException;
import yc.ma.LearnTogether.user.application.dto.request.create.ProfileCreateDTO;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.request.update.UserUpdateDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.application.mapper.ProfileMapper;
import yc.ma.LearnTogether.user.application.mapper.UserMapper;
import yc.ma.LearnTogether.user.domain.model.User;
import yc.ma.LearnTogether.user.domain.repository.UserRepository;
import yc.ma.LearnTogether.user.domain.service.UserService;


@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultUserService implements UserService {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final ProfileMapper profileMapper;

    // => todo : use projection to avoid extra mapping here
    public PagedResult<UserResponseDTO> findUsers ( int pageNo, int pageSize ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(pageNo > 0 ? pageNo - 1 : 0, pageSize, sort);
        return new PagedResult<>(repository.findAll(pageable).map(mapper::toResponseDto));
    }

    @Override
    public UserResponseDTO findById ( Long id ) {
        return mapper.toResponseDto(findUserById(id));
    }

    private User findUserById ( Long id ) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("User", id));
    }


    @Override
    @Transactional
    public UserResponseDTO create ( UserRequestDTO userDto ) {
        User user = User.create(userDto.fullName(), userDto.email(), userDto.password(), userDto.role());
        User savedUser = repository.save(user);

        savedUser.getProfile().withUserId(savedUser.getId());

        return mapper.toResponseDto(repository.save(savedUser));
    }

    @Transactional
    public UserResponseDTO updateUserProfile ( Long userId, ProfileCreateDTO profile ) {
        User user = findUserById(userId);
        user.updateProfile(profileMapper.toEntity(profile));
        return mapper.toResponseDto(repository.save(user));
    }

    @Override
    @Transactional
    public UserResponseDTO update ( Long id, UserUpdateDTO userDto ) {
        User user = findUserById(id);
        user.updateDetails(userDto.fullName(), userDto.email(), userDto.password());

        return mapper.toResponseDto(repository.save(user));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = findUserById(id);
        repository.delete(user);
    }



    @Override
    public Page<UserResponseDTO> findAll ( Pageable pageable ) {
        Page<User> usersPage = repository.findAll(pageable);
        return usersPage.map(mapper::toResponseDto);
    }

}