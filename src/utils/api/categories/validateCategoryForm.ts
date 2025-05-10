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

  // Check if name is empty
  if (!values.name) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_REQUIRED;
  } 
  // Check if name is a string type
  else if (typeof values.name !== "string") {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_NOT_STRING;
  } 
  // Check minimum length (2 characters)
  else if (values.name.length < 2) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_TOO_SHORT;
  } 
  // Check maximum length (50 characters)
  else if (values.name.length > 50) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_TOO_LONG;
  } 
  // Check if name contains at least two letters
  else if (!/[A-Za-z].*[A-Za-z]/.test(values.name)) {
    errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_MINIMUM_LETTERS;
  } 
  // Check format-specific requirements
  else {
    // Check if name starts with a number or dot
    if (/^[0-9.]/.test(values.name)) {
      errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_WITH_NUMBER_OR_DOT;
    } 
    // Check if name starts or ends with a hyphen
    else if (values.name.startsWith("-") || values.name.endsWith("-")) {
      errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_STARTS_OR_ENDS_WITH_HYPHEN;
    } 
    // Check for consecutive hyphens
    else if (values.name.includes("--")) {
      errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_CONSECUTIVE_HYPHENS;
    } 
    // Check if name contains only allowed characters (letters, numbers, spaces, dots, hyphens)
    else if (!/^[A-Za-z0-9 .-]+$/.test(values.name)) {
      errors.name = RESPONSE_MESSAGES.category.VALIDATIONS.NAME_INVALID_CHARS;
    }
  }

  return errors;
};

export default validateCategoryForm;
