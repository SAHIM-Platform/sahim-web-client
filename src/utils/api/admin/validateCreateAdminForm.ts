import RESPONSE_MESSAGES from "../../constants/RESPONSE_MESSAGES";

export interface AdminFormData {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const validateCreateAdminForm = (values: Partial<AdminFormData>) => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!values.name?.trim()) {
    errors.name = RESPONSE_MESSAGES.signup.VALIDATIONS.NAME_REQUIRED;
  } else if (values.name.length < 3) {
    errors.name = RESPONSE_MESSAGES.signup.VALIDATIONS.NAME_TOO_SHORT;
  } else if (values.name.length > 100) {
    errors.name = RESPONSE_MESSAGES.signup.VALIDATIONS.NAME_TOO_LONG;
  }

  // Username validation
  if (!values.username?.trim()) {
    errors.username = RESPONSE_MESSAGES.signup.VALIDATIONS.USERNAME_REQUIRED;
  } else if (values.username.length < 3) {
    errors.username = RESPONSE_MESSAGES.signup.VALIDATIONS.USERNAME_TOO_SHORT;
  } else if (values.username.length > 50) {
    errors.username = RESPONSE_MESSAGES.signup.VALIDATIONS.USERNAME_TOO_LONG;
  } else if (!/^[a-zA-Z0-9_-]+$/.test(values.username)) {
    errors.username = RESPONSE_MESSAGES.signup.VALIDATIONS.USERNAME_INVALID_FORMAT;
  }

  // Password validation
  if (!values.password?.trim()) {
    errors.password = RESPONSE_MESSAGES.signup.VALIDATIONS.PASSWORD_REQUIRED;
  } else if (values.password.length < 8) {
    errors.password = RESPONSE_MESSAGES.signup.VALIDATIONS.PASSWORD_TOO_SHORT;
  } else if (values.password.length > 72) {
    errors.password = RESPONSE_MESSAGES.signup.VALIDATIONS.PASSWORD_TOO_LONG;
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = RESPONSE_MESSAGES.signup.VALIDATIONS.PASSWORD_UPPERCASE;
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = RESPONSE_MESSAGES.signup.VALIDATIONS.PASSWORD_LOWERCASE;
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = RESPONSE_MESSAGES.signup.VALIDATIONS.PASSWORD_NUMBER;
  } else if (!/[@$!%*?&]/.test(values.password)) {
    errors.password = RESPONSE_MESSAGES.signup.VALIDATIONS.PASSWORD_SPECIAL;
  }

  // Confirm password validation
  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = RESPONSE_MESSAGES.signup.VALIDATIONS.CONFIRM_PASSWORD_REQUIRED;
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = RESPONSE_MESSAGES.signup.VALIDATIONS.CONFIRM_PASSWORD_MISMATCH;
  }

  return errors;
};

export default validateCreateAdminForm; 