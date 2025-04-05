import { Department, Level } from "@/types";

export interface SignupFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  academicNumber: string;
  department: Department;
  studyLevel: Level;
}

export const validateSignupForm = (values: Partial<SignupFormData>) => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!values.name?.trim()) {
    errors.name = "الاسم مطلوب";
  }

  // Academic number validation
  if (!values.academicNumber?.trim()) {
    errors.academicNumber = "الرقم الأكاديمي مطلوب";
  } else if (!/^\d{9}$/.test(values.academicNumber)) {
    errors.academicNumber = "الرقم الأكاديمي يجب أن يتكون من 9 أرقام";
  }

  // Email validation
  if (!values.email?.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "البريد الإلكتروني غير صالح";
  }

  // Username validation
  if (!values.username?.trim()) {
    errors.username = "اسم المستخدم مطلوب";
  } else if (values.username.length < 3) {
    errors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
  }

  // Password validation
  if (!values.password?.trim()) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (values.password.length < 8) {
    errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  }

  // Confirm password validation
  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "كلمة المرور غير متطابقة";
  }

  // Department validation
  if (!values.department) {
    errors.department = "القسم مطلوب";
  }

  // Study level validation
  if (!values.studyLevel) {
    errors.studyLevel = "المستوى الدراسي مطلوب";
  }

  return errors;
};

export default validateSignupForm; 