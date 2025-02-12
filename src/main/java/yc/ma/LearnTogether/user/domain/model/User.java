package yc.ma.LearnTogether.user.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users", schema = "youcoder")
public class User {
    @Id
    private Long id;
    private String fullName;
    private String email;
    private String password;
}
