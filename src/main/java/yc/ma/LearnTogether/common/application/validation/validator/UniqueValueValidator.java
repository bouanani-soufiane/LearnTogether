package yc.ma.LearnTogether.common.application.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;

@Component
@RequiredArgsConstructor
@Slf4j
public class UniqueValueValidator implements ConstraintValidator<UniqueValue, Object> {

    private final JdbcTemplate jdbcTemplate;
    private String schemaName;
    private String tableName;
    private String columnName;

    @Override
    public void initialize ( UniqueValue constraintAnnotation ) {
        this.schemaName = constraintAnnotation.schemaName();
        this.tableName = constraintAnnotation.tableName();
        this.columnName = constraintAnnotation.fieldName();
    }

    @Override
    public boolean isValid ( Object value, ConstraintValidatorContext context ) {
        if (value == null) {
            return true;
        }

        String sql = String.format("SELECT COUNT(*) FROM %s.%s WHERE %s = ?", schemaName, tableName, columnName);
        log.info(sql);
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, value);

        return count == null || count == 0;
    }
}