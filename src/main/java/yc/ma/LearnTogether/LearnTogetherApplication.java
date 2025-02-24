package yc.ma.LearnTogether;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories;

@SpringBootApplication
@EnableJdbcRepositories
public class LearnTogetherApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearnTogetherApplication.class, args);
	}

}
