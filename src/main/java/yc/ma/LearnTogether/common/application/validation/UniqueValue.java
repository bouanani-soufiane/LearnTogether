package yc.ma.LearnTogether.common.application.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import yc.ma.LearnTogether.common.application.validation.validator.UniqueValueValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = UniqueValueValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueValue {
    String message() default "Field must be unique";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String fieldName();

    String schemaName();

    String tableName();
}