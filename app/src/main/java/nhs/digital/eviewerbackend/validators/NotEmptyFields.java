package nhs.digital.eviewerbackend.validators;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NotEmptyFieldsValidator.class)
public @interface NotEmptyFields {

    String message() default "List cannot contain empty fields";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}



