import { Department, Level } from "@/types";
import validateSignupForm, { SignupFormData } from "./validateSignupForm";
import ERROR_MESSAGES from "../../constants/ERROR_MESSAGES";

describe("validateSignupForm", () => {
  // Helper function to create valid form data
  const createValidFormData = (): SignupFormData => ({
    email: "user@example.com",
    username: "valid_user-123",
    password: "ValidPass1@",
    confirmPassword: "ValidPass1@",
    name: "Valid Name",
    academicNumber: "4390123456789",
    department: Department.IT,
    studyLevel: Level.LEVEL_1
  });

  describe("Name Validation", () => {
    it("should validate required name", () => {
      const data = createValidFormData();
      data.name = "";
      const errors = validateSignupForm(data);
      expect(errors.name).toBe(ERROR_MESSAGES.signup.VALIDATIONS.NAME_REQUIRED);
    });

    it("should validate minimum name length", () => {
      const data = createValidFormData();
      data.name = "ab";
      const errors = validateSignupForm(data);
      expect(errors.name).toBe(ERROR_MESSAGES.signup.VALIDATIONS.NAME_TOO_SHORT);
    });

    it("should validate maximum name length", () => {
      const data = createValidFormData();
      data.name = "a".repeat(101);
      const errors = validateSignupForm(data);
      expect(errors.name).toBe(ERROR_MESSAGES.signup.VALIDATIONS.NAME_TOO_LONG);
    });

    it("should accept valid name", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.name).toBeUndefined();
    });
  });

  describe("Academic Number Validation", () => {
    it("should validate required academic number", () => {
      const data = createValidFormData();
      data.academicNumber = "";
      const errors = validateSignupForm(data);
      expect(errors.academicNumber).toBe(ERROR_MESSAGES.signup.VALIDATIONS.ACADEMIC_REQUIRED);
    });

    it("should validate academic number length", () => {
      const data = createValidFormData();
      data.academicNumber = "12345";
      const errors = validateSignupForm(data);
      expect(errors.academicNumber).toBe(ERROR_MESSAGES.signup.VALIDATIONS.ACADEMIC_LENGTH);
    });

    it("should validate academic number format", () => {
      const data = createValidFormData();
      data.academicNumber = "123abc4567890";
      const errors = validateSignupForm(data);
      expect(errors.academicNumber).toBe(ERROR_MESSAGES.signup.VALIDATIONS.ACADEMIC_ONLY_NUMBERS);
    });

    it("should accept valid academic number", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.academicNumber).toBeUndefined();
    });
  });

  describe("Email Validation", () => {
    it("should validate required email", () => {
      const data = createValidFormData();
      data.email = "";
      const errors = validateSignupForm(data);
      expect(errors.email).toBe(ERROR_MESSAGES.signup.VALIDATIONS.EMAIL_REQUIRED);
    });

    it("should validate email format", () => {
      const data = createValidFormData();
      data.email = "invalid-email";
      const errors = validateSignupForm(data);
      expect(errors.email).toBe(ERROR_MESSAGES.signup.VALIDATIONS.EMAIL_INVALID);
    });

    it("should validate maximum email length", () => {
      const data = createValidFormData();
      data.email = `${"a".repeat(247)}@test.com`; // 256 characters
      const errors = validateSignupForm(data);
      expect(errors.email).toBe(ERROR_MESSAGES.signup.VALIDATIONS.EMAIL_TOO_LONG);
    });

    it("should accept valid email", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.email).toBeUndefined();
    });
  });

  describe("Username Validation", () => {
    it("should validate required username", () => {
      const data = createValidFormData();
      data.username = "";
      const errors = validateSignupForm(data);
      expect(errors.username).toBe(ERROR_MESSAGES.signup.VALIDATIONS.USERNAME_REQUIRED);
    });

    it("should validate minimum username length", () => {
      const data = createValidFormData();
      data.username = "ab";
      const errors = validateSignupForm(data);
      expect(errors.username).toBe(ERROR_MESSAGES.signup.VALIDATIONS.USERNAME_TOO_SHORT);
    });

    it("should validate maximum username length", () => {
      const data = createValidFormData();
      data.username = "a".repeat(51);
      const errors = validateSignupForm(data);
      expect(errors.username).toBe(ERROR_MESSAGES.signup.VALIDATIONS.USERNAME_TOO_LONG);
    });

    it("should validate username format", () => {
      const data = createValidFormData();
      data.username = "user@name";
      const errors = validateSignupForm(data);
      expect(errors.username).toBe(ERROR_MESSAGES.signup.VALIDATIONS.USERNAME_INVALID_FORMAT);
    });

    it("should accept valid username", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.username).toBeUndefined();
    });
  });

  describe("Password Validation", () => {
    it("should validate required password", () => {
      const data = createValidFormData();
      data.password = "";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_REQUIRED);
    });

    it("should validate minimum password length", () => {
      const data = createValidFormData();
      data.password = "Short1@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_TOO_SHORT);
    });

    it("should validate maximum password length", () => {
      const data = createValidFormData();
      data.password = `${"a".repeat(71)}A1@`; // 73 characters
      const errors = validateSignupForm(data);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_TOO_LONG);
    });

    it("should validate uppercase requirement", () => {
      const data = createValidFormData();
      data.password = "lowercase1@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_UPPERCASE);
    });

    it("should validate lowercase requirement", () => {
      const data = createValidFormData();
      data.password = "UPPERCASE1@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_LOWERCASE);
    });

    it("should validate number requirement", () => {
      const data = createValidFormData();
      data.password = "Password@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_NUMBER);
    });

    it("should validate special character requirement", () => {
      const data = createValidFormData();
      data.password = "Password123";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_SPECIAL);
    });

    it("should accept valid password", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.password).toBeUndefined();
    });
  });

  describe("Confirm Password Validation", () => {
    it("should validate required confirm password", () => {
      const data = createValidFormData();
      data.confirmPassword = "";
      const errors = validateSignupForm(data);
      expect(errors.confirmPassword).toBe(ERROR_MESSAGES.signup.VALIDATIONS.CONFIRM_PASSWORD_REQUIRED);
    });

    it("should validate password match", () => {
      const data = createValidFormData();
      data.confirmPassword = "DifferentPass1@";
      const errors = validateSignupForm(data);
      expect(errors.confirmPassword).toBe(ERROR_MESSAGES.signup.VALIDATIONS.CONFIRM_PASSWORD_MISMATCH);
    });

    it("should accept matching passwords", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.confirmPassword).toBeUndefined();
    });
  });

  describe("Department Validation", () => {
    it("should validate required department", () => {
      const data = createValidFormData();
      data.department = "" as Department;
      const errors = validateSignupForm(data);
      expect(errors.department).toBe(ERROR_MESSAGES.signup.VALIDATIONS.DEPARTMENT_REQUIRED);
    });

    it("should validate department enum value", () => {
      const data = createValidFormData();
      data.department = "INVALID" as Department;
      const errors = validateSignupForm(data);
      expect(errors.department).toBe(ERROR_MESSAGES.signup.VALIDATIONS.DEPARTMENT_INVALID);
    });

    it("should accept valid department", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.department).toBeUndefined();
    });
  });

  describe("Study Level Validation", () => {
    it("should validate required study level", () => {
      const data = createValidFormData();
      data.studyLevel = undefined as unknown as Level;
      const errors = validateSignupForm(data);
      expect(errors.studyLevel).toBe(ERROR_MESSAGES.signup.VALIDATIONS.STUDY_LEVEL_REQUIRED);
    });

    it("should validate study level range", () => {
      const data = createValidFormData();
      data.studyLevel = 6 as Level;
      const errors = validateSignupForm(data);
      expect(errors.studyLevel).toBe(ERROR_MESSAGES.signup.VALIDATIONS.STUDY_LEVEL_INVALID);
    });

    it("should accept valid study level", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(errors.studyLevel).toBeUndefined();
    });
  });

  describe("Multiple Field Validation", () => {
    it("should validate multiple invalid fields", () => {
      const data = {
        ...createValidFormData(),
        email: "invalid",
        password: "short",
        username: "@invalid@",
        department: undefined as unknown as Department,
        studyLevel: undefined as unknown as Level,
      };

      const errors = validateSignupForm(data);

      expect(errors.email).toBe(ERROR_MESSAGES.signup.VALIDATIONS.EMAIL_INVALID);
      expect(errors.password).toBe(ERROR_MESSAGES.signup.VALIDATIONS.PASSWORD_TOO_SHORT);
      expect(errors.username).toBe(ERROR_MESSAGES.signup.VALIDATIONS.USERNAME_INVALID_FORMAT);
      expect(errors.department).toBe(ERROR_MESSAGES.signup.VALIDATIONS.DEPARTMENT_REQUIRED);
      expect(errors.studyLevel).toBe(ERROR_MESSAGES.signup.VALIDATIONS.STUDY_LEVEL_REQUIRED);
    });

    it("should return no errors for valid data", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
}); 