package yc.ma.LearnTogether.user.application.service.impl;

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
import yc.ma.LearnTogether.user.application.dto.FindUsersQuery;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.request.update.UserUpdateDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.application.mapper.UserMapper;
import yc.ma.LearnTogether.user.application.service.UserService;
import yc.ma.LearnTogether.user.domain.model.Profile;
import yc.ma.LearnTogether.user.domain.model.User;
import yc.ma.LearnTogether.user.domain.repository.UserRepository;


@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultUserService implements UserService {

    private final UserRepository repository;
    private final UserMapper mapper;

    @Override
    @Transactional
    public UserResponseDTO create ( UserRequestDTO user ) {
        User savedUser = repository.save(mapper.toEntity(user));
        savedUser.setProfile(new Profile().withUserId(savedUser.getId()));
        return mapper.toResponseDto(savedUser);
    }

    @Transactional
    public UserResponseDTO updateUserProfile ( Long userId, Profile profile ) {
        User user = findUserById(userId);
        user.setProfile(profile);
        return mapper.toResponseDto(repository.save(user));
    }

    @Override
    public UserResponseDTO update ( Long id, UserUpdateDTO userDto ) {
        return null;
    }


    @Override
    public Page<UserResponseDTO> findAll ( Pageable pageable ) {
        Page<User> usersPage = repository.findAll(pageable);
        return usersPage.map(mapper::toResponseDto);
    }

    @Override
    public UserResponseDTO findById ( Long id ) {
        return mapper.toResponseDto(findUserById(id));
    }

    @Override
    @Transactional
    public void delete ( Long id ) {
        if (!repository.existsById(id)) throw new NotFoundException("User", id);
        repository.deleteById(id);
    }

    @Override
    public User findUserById ( Long id ) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("User", id));
    }
    public PagedResult<UserResponseDTO> findUsers( FindUsersQuery query) {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        int pageNo = query.pageNo() > 0 ? query.pageNo() - 1 : 0;
        Pageable pageable = PageRequest.of(pageNo, query.pageSize(), sort);

        Page<UserResponseDTO> page = repository.findAll(pageable).map(mapper::toResponseDto);

        return new PagedResult<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber() + 1,
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}