import { Department, Level } from "@/types";
import RESPONSE_MESSAGES from "../../constants/RESPONSE_MESSAGES";

export enum AuthMethod {
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  OAUTH_GOOGLE = 'OAUTH_GOOGLE',
}

export interface SignupFormData {
  email?: string;
  username: string;
  password?: string;
  confirmPassword?: string;
  authMethod?: AuthMethod;
  name: string;
  academicNumber: string;
  department: Department;
  studyLevel: Level;
}

export const validateSignupForm = (values: Partial<SignupFormData>) => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!values.name?.trim()) {
    errors.name = RESPONSE_MESSAGES.signup.VALIDATIONS.NAME_REQUIRED;
  } else if (values.name.length < 3) {
    errors.name = RESPONSE_MESSAGES.signup.VALIDATIONS.NAME_TOO_SHORT;
  } else if (values.name.length > 100) {
    errors.name = RESPONSE_MESSAGES.signup.VALIDATIONS.NAME_TOO_LONG;
  }

  // Academic number validation
  if (!values.academicNumber) {
    errors.academicNumber = RESPONSE_MESSAGES.signup.VALIDATIONS.ACADEMIC_REQUIRED;
  } else if (typeof values.academicNumber !== 'string') {
    errors.academicNumber = RESPONSE_MESSAGES.signup.VALIDATIONS.ACADEMIC_NOT_STRING;
  } else if (!values.academicNumber.trim()) {
    errors.academicNumber = RESPONSE_MESSAGES.signup.VALIDATIONS.ACADEMIC_REQUIRED;
  } else if (!/^\d+$/.test(values.academicNumber)) {
    errors.academicNumber = RESPONSE_MESSAGES.signup.VALIDATIONS.ACADEMIC_ONLY_NUMBERS;
  } else if (!/^\d{5}$|^\d{6}$|^\d{13}$/.test(values.academicNumber)) {
    errors.academicNumber = RESPONSE_MESSAGES.signup.VALIDATIONS.ACADEMIC_LENGTH;
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

  // Department validation
  if (!values.department) {
    errors.department = RESPONSE_MESSAGES.signup.VALIDATIONS.DEPARTMENT_REQUIRED;
  } else if (!(values.department in Department)) {
    errors.department = RESPONSE_MESSAGES.signup.VALIDATIONS.DEPARTMENT_INVALID;
  }

  // Study level validation
  if (!values.studyLevel) {
    errors.studyLevel = RESPONSE_MESSAGES.signup.VALIDATIONS.STUDY_LEVEL_REQUIRED;
  } else {
    const level = Number(values.studyLevel);
    if (isNaN(level) || level < 1 || level > 5) {
      errors.studyLevel = RESPONSE_MESSAGES.signup.VALIDATIONS.STUDY_LEVEL_INVALID;
    }
  }

  // Email validation
  if (!values.email?.trim()) {
    errors.email = RESPONSE_MESSAGES.signup.VALIDATIONS.EMAIL_REQUIRED;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = RESPONSE_MESSAGES.signup.VALIDATIONS.EMAIL_INVALID;
  } else if (values.email.length > 255) {
    errors.email = RESPONSE_MESSAGES.signup.VALIDATIONS.EMAIL_TOO_LONG;
  }

  return errors;
};

export default validateSignupForm; 