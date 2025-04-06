import { Department, Level } from "@/types";
import validateSignupForm, { SignupFormData } from "./validateSignupForm";

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
      expect(errors.name).toBe("الاسم مطلوب");
    });

    it("should validate minimum name length", () => {
      const data = createValidFormData();
      data.name = "ab";
      const errors = validateSignupForm(data);
      expect(errors.name).toBe("الاسم يجب ان 3 أحرف على الأقل");
    });

    it("should validate maximum name length", () => {
      const data = createValidFormData();
      data.name = "a".repeat(101);
      const errors = validateSignupForm(data);
      expect(errors.name).toBe("الاسم يجب ان لا يتجاوز 100 حرف");
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
      expect(errors.academicNumber).toBe("الرقم الأكاديمي مطلوب");
    });

    it("should validate academic number length", () => {
      const data = createValidFormData();
      data.academicNumber = "12345";
      const errors = validateSignupForm(data);
      expect(errors.academicNumber).toBe("الرقم الأكاديمي يجب أن يتكون من 13 رقم");
    });

    it("should validate academic number format", () => {
      const data = createValidFormData();
      data.academicNumber = "123abc4567890";
      const errors = validateSignupForm(data);
      expect(errors.academicNumber).toBe("الرقم الأكاديمي يجب أن يتكون من أرقام صحيحة فقط");
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
      expect(errors.email).toBe("البريد الإلكتروني مطلوب");
    });

    it("should validate email format", () => {
      const data = createValidFormData();
      data.email = "invalid-email";
      const errors = validateSignupForm(data);
      expect(errors.email).toBe("البريد الإلكتروني غير صالح");
    });

    it("should validate maximum email length", () => {
      const data = createValidFormData();
      data.email = `${"a".repeat(247)}@test.com`; // 256 characters
      const errors = validateSignupForm(data);
      expect(errors.email).toBe("البريد الإلكتروني يجب ان لا يتجاوز 255 حرف");
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
      expect(errors.username).toBe("اسم المستخدم مطلوب");
    });

    it("should validate minimum username length", () => {
      const data = createValidFormData();
      data.username = "ab";
      const errors = validateSignupForm(data);
      expect(errors.username).toBe("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
    });

    it("should validate maximum username length", () => {
      const data = createValidFormData();
      data.username = "a".repeat(51);
      const errors = validateSignupForm(data);
      expect(errors.username).toBe("اسم المستخدم يجب ان لا يتجاوز 50 حرف");
    });

    it("should validate username format", () => {
      const data = createValidFormData();
      data.username = "user@name";
      const errors = validateSignupForm(data);
      expect(errors.username).toBe("اسم المستخدم يمكن أن يحتوي على حروف إنجليزية، أرقام، شرطات سفلية _ ، وشرطات فقط");
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
      expect(errors.password).toBe("كلمة المرور مطلوبة");
    });

    it("should validate minimum password length", () => {
      const data = createValidFormData();
      data.password = "Short1@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    });

    it("should validate maximum password length", () => {
      const data = createValidFormData();
      data.password = `${"a".repeat(71)}A1@`; // 73 characters
      const errors = validateSignupForm(data);
      expect(errors.password).toBe("كلمة المرور يجب ان لا يتجاوز 72 حرف");
    });

    it("should validate uppercase requirement", () => {
      const data = createValidFormData();
      data.password = "lowercase1@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe("كلمة المرور يجب ان تحتوى حرف واحد كبير على الأقل");
    });

    it("should validate lowercase requirement", () => {
      const data = createValidFormData();
      data.password = "UPPERCASE1@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe("كلمة المرور يجب ان تحتوى حرف واحد صغير على الأقل");
    });

    it("should validate number requirement", () => {
      const data = createValidFormData();
      data.password = "Password@";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe("كلمة المرور يجب ان تحتوى على رقم رقم واحد على الأقل");
    });

    it("should validate special character requirement", () => {
      const data = createValidFormData();
      data.password = "Password123";
      const errors = validateSignupForm(data);
      expect(errors.password).toBe("(@$!%*?&)كلمة المرور يجب ان تحتوى على رموز خاصة");
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
      expect(errors.confirmPassword).toBe("تأكيد كلمة المرور مطلوب");
    });

    it("should validate password match", () => {
      const data = createValidFormData();
      data.confirmPassword = "DifferentPass1@";
      const errors = validateSignupForm(data);
      expect(errors.confirmPassword).toBe("كلمة المرور غير متطابقة");
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
      expect(errors.department).toBe("القسم مطلوب");
    });

    it("should validate department enum value", () => {
      const data = createValidFormData();
      data.department = "INVALID" as Department;
      const errors = validateSignupForm(data);
      expect(errors.department).toBe("يرجى إدخال القسم بشكل صحيح ويتطابق مع القيم المتاحة");
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
      expect(errors.studyLevel).toBe("المستوى الدراسي مطلوب");
    });

    it("should validate study level range", () => {
      const data = createValidFormData();
      data.studyLevel = 6 as Level;
      const errors = validateSignupForm(data);
      expect(errors.studyLevel).toBe("المستوى الدراسي يجب أن يكون رقماً بين 1 و 5");
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
      
      expect(errors.email).toBe("البريد الإلكتروني غير صالح");
      expect(errors.password).toBe("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      expect(errors.username).toBe("اسم المستخدم يمكن أن يحتوي على حروف إنجليزية، أرقام، شرطات سفلية _ ، وشرطات فقط");
      expect(errors.department).toBe("القسم مطلوب");
      expect(errors.studyLevel).toBe("المستوى الدراسي مطلوب");
    });

    it("should return no errors for valid data", () => {
      const data = createValidFormData();
      const errors = validateSignupForm(data);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
}); 