package yc.ma.LearnTogether.common.application.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import yc.ma.LearnTogether.common.application.validation.validator.EntityExistenceValidator;

import java.lang.annotation.*;

@Constraint(validatedBy = EntityExistenceValidator.class)
@Documented
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface EntityExists {

    String message () default "Entity does not exist";

    Class<?>[] groups () default {};

    Class<? extends Payload>[] payload () default {};

    Class<?> entity ();
}