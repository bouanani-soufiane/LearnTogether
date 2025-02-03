package yc.ma.LearnTogether;

import org.springframework.boot.SpringApplication;

public class TestLearnTogetherApplication {

	public static void main(String[] args) {
		SpringApplication.from(LearnTogetherApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
