package yc.ma.LearnTogether.common.application.validation.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;

@Component
@RequiredArgsConstructor
public class UniqueValueValidator implements ConstraintValidator<UniqueValue, Object> {

    private final JdbcTemplate jdbcTemplate;
    private String tableName;
    private String columnName;

    @Override
    public void initialize(UniqueValue constraintAnnotation) {
        this.tableName = constraintAnnotation.entityClass().getSimpleName();
        this.columnName = constraintAnnotation.fieldName();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        String sql = String.format("SELECT COUNT(*) FROM %s WHERE %s = ?", tableName, columnName);
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, value);

        return count == null || count == 0;
    }
}