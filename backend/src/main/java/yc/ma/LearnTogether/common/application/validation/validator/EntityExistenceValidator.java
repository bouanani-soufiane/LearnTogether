package yc.ma.LearnTogether.common.application.validation.validator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import yc.ma.LearnTogether.common.application.validation.EntityExists;

@Slf4j
@Component
@RequiredArgsConstructor
public class EntityExistenceValidator implements ConstraintValidator<EntityExists, Object> {

    private final JdbcTemplate jdbcTemplate;
    private String tableName;

    @Override
    public void initialize(EntityExists constraintAnnotation) {
        this.tableName = constraintAnnotation.entity().getSimpleName();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        String sql = String.format("SELECT COUNT(*) FROM %s WHERE id = ?", tableName);
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, value);

        return count != null && count > 0;
    }
}
