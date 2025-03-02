package yc.ma.LearnTogether.user.infrastructure.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
@Component
public class JwtProperties {
    private String secret;
    private long expirationMs;
    private String tokenHeader = "Authorization";
    private String tokenPrefix = "Bearer ";
}