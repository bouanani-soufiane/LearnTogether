package yc.ma.LearnTogether.user.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.user.application.dto.request.create.ProfileCreateDTO;
import yc.ma.LearnTogether.user.application.dto.request.create.UserRequestDTO;
import yc.ma.LearnTogether.user.application.dto.request.update.UserUpdateDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.domain.service.impl.DefaultUserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {

    private final DefaultUserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> create ( @Valid @RequestBody UserRequestDTO user ) {
        UserResponseDTO createdUser = userService.create(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserResponseDTO> updateProfile ( @PathVariable Long userId, @Valid @RequestBody ProfileCreateDTO profile ) {
        UserResponseDTO updatedUser = userService.updateUserProfile(userId, profile);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById ( @PathVariable Long id ) {
        UserResponseDTO user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser ( @PathVariable Long id ) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public PagedResult<UserResponseDTO> findUsers (
            @RequestParam(name = "page", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "size", defaultValue = "10") Integer pageSize
    ) {
        return userService.findUsers(pageNo, pageSize);
    }
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> update(
            @PathVariable Long userId,
            @RequestBody UserUpdateDTO userUpdateDTO
            ){
        UserResponseDTO user = userService.update(userId, userUpdateDTO);

        return ResponseEntity.ok(user);
    }
}
