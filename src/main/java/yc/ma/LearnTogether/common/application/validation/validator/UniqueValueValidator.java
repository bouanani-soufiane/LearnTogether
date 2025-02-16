package yc.ma.LearnTogether.common.application.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import yc.ma.LearnTogether.common.application.validation.UniqueValue;

@Component
@RequiredArgsConstructor
public class UniqueValueValidator implements ConstraintValidator<UniqueValue, Object> {

    private final JdbcTemplate jdbcTemplate;
    private String tableName;
    private String columnName;
    private String schemaName;

    @Override
    public void initialize ( UniqueValue constraintAnnotation ) {
        this.tableName = constraintAnnotation.tableName();
        this.columnName = constraintAnnotation.fieldName();
        this.schemaName = constraintAnnotation.schemaName();
    }

    @Override
    public boolean isValid ( Object value, ConstraintValidatorContext context ) {
        if (value == null) {
            return true;
        }

        String sql = String.format("SELECT COUNT(*) FROM %s.%s WHERE %s = ?", schemaName, tableName, columnName);
        System.out.println("Executing SQL: " + sql);

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, value);

        return count == null || count == 0;
    }
}