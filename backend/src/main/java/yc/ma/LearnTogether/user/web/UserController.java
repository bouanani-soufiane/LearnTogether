package yc.ma.LearnTogether.user.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yc.ma.LearnTogether.common.application.PagedResult;
import yc.ma.LearnTogether.user.application.dto.request.create.ProfileCreateDTO;
import yc.ma.LearnTogether.user.application.dto.request.update.UserUpdateDTO;
import yc.ma.LearnTogether.user.application.dto.response.UserResponseDTO;
import yc.ma.LearnTogether.user.domain.service.UserService;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> update(
            @PathVariable Long userId,
            @Valid @RequestBody UserUpdateDTO userUpdateDTO
    ){
        UserResponseDTO user = userService.update(userId, userUpdateDTO);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserResponseDTO> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileCreateDTO profile
    ) {
        log.info("Received profile update request: {}", profile);
        UserResponseDTO updatedUser = userService.updateUserProfile(userId, profile);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public PagedResult<UserResponseDTO> findUsers(
            @RequestParam(name = "page", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "size", defaultValue = "10") Integer pageSize
    ) {
        return userService.findUsers(pageNo, pageSize);
    }
}