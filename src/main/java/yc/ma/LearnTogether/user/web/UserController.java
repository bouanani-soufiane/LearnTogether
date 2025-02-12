package yc.ma.LearnTogether.user.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import yc.ma.LearnTogether.user.application.UserService;
import yc.ma.LearnTogether.user.domain.model.User;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController ( UserService userService ) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser ( @RequestBody User user ) {
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
}
