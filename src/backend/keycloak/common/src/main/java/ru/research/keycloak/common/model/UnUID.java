package ru.research.keycloak.common.model;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.Pattern;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Validation constraint for a UUID in string format.
 * <p>
 * e.g. 6cfb0496-fa35-4668-a970-78a873d7970e
 *
 * @author Rüdiger Schulz &lt;rs@mindhaq.com&gt;
 */
@Pattern(regexp = "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
@Retention(RUNTIME)
@Target({METHOD, FIELD, PARAMETER, ANNOTATION_TYPE})
@Constraint(validatedBy = {})
@Documented
public @interface UnUID {
    String message() default "UUID has wrong format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}