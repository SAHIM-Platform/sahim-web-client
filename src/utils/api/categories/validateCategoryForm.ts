import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";

/**
 * Validates the category form input.
 * @param values - Form values to validate.
 * @returns An object containing validation errors, if any.
 */
const validateCategoryForm = (
  values: Record<string, string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // @IsString
  if (typeof values.name !== "string") {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_NOT_STRING;
    return errors;
  }

  // @IsNotEmpty
  if (!values.name) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_REQUIRED;
    return errors;
  }

  // @MinLength(2)
  if (values.name.length < 2) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_TOO_SHORT;
    return errors;
  }

  // @MaxLength(50)
  if (values.name.length > 50) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_TOO_LONG;
    return errors;
  }

  // Must include at least two letters (Arabic or English)
  if (!/.*[A-Za-z\u0600-\u06FF].*[A-Za-z\u0600-\u06FF]/.test(values.name)) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_MINIMUM_LETTERS;
    return errors;
  }

  // @Matches pattern validations
  // Cannot start with a number or dot
  if (/^[0-9.]/.test(values.name)) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_WITH_NUMBER_OR_DOT;
    return errors;
  }

  // Cannot start or end with a hyphen
  if (values.name.startsWith("-") || values.name.endsWith("-")) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_OR_ENDS_WITH_HYPHEN;
    return errors;
  }

  // Cannot contain consecutive hyphens
  if (values.name.includes("--")) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_CONSECUTIVE_HYPHENS;
    return errors;
  }

  // Only allowed characters
  if (!/^[A-Za-z0-9\u0600-\u06FF .-]+$/.test(values.name)) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_INVALID_CHARS;
    return errors;
  }

  return errors;
};

export default validateCategoryForm;
