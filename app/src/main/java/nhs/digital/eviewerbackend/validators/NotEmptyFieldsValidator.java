package nhs.digital.eviewerbackend.validators;

import java.util.List;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NotEmptyFieldsValidator implements ConstraintValidator<NotEmptyFields, List<String>> {

    @Override
    public void initialize(NotEmptyFields notEmptyFields) {
    	 // Do nothing because this method for annotation.
    }

    @Override
    public boolean isValid(List<String> objects, ConstraintValidatorContext context) {
        return objects.stream().allMatch(nef -> !nef.trim().isEmpty());
    }

}