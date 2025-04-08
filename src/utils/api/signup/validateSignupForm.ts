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
  } else if (values.name.length < 3) {
    errors.name = "يجب أن يحتوي الاسم على 3 أحرف على الأقل";
  } else if (values.name.length > 100) {
    errors.name = "يجب أن لا يتجاوز الاسم 100 حرف";
  }

  // Academic number validation
  if (!values.academicNumber?.trim()) {
    errors.academicNumber = "الرقم الأكاديمي مطلوب";
  } else if (values.academicNumber.length !== 13) {
    errors.academicNumber = "يجب أن يتكون الرقم الأكاديمي من 13 رقم";
  } else if (!/^\d+$/.test(values.academicNumber)) {
    errors.academicNumber = "يجب أن يحتوي الرقم الأكاديمي على أرقام فقط";
  }

  // Email validation
  if (!values.email?.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صالح";
  } else if (values.email.length > 255) {
    errors.email = "يجب أن لا يتجاوز البريد الإلكتروني 255 حرف";
  }

  // Username validation
  if (!values.username?.trim()) {
    errors.username = "اسم المستخدم مطلوب";
  } else if (values.username.length < 3) {
    errors.username = "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل";
  } else if (values.username.length > 50) {
    errors.username = "يجب أن لا يتجاوز اسم المستخدم 50 حرف";
  } else if (!/^[a-zA-Z0-9_-]+$/.test(values.username)) {
    errors.username = "يمكن أن يحتوي اسم المستخدم على حروف إنجليزية وأرقام وشرطات (_-) فقط";
  }

  // Password validation
  if (!values.password?.trim()) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (values.password.length < 8) {
    errors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل";
  } else if (values.password.length > 72) {
    errors.password = "يجب أن لا تتجاوز كلمة المرور 72 حرف";
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل";
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل";
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
  } else if (!/[@$!%*?&]/.test(values.password)) {
    errors.password = "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (@$!%*?&)";
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
  } else if (!(values.department in Department)) {
    errors.department = "يرجى اختيار قسم صالح من القائمة";
  }

  // Study level validation
  if (!values.studyLevel) {
    errors.studyLevel = "المستوى الدراسي مطلوب";
  } else {
    const level = Number(values.studyLevel);
    if (isNaN(level) || level < 1 || level > 5) {
      errors.studyLevel = "يرجى اختيار مستوى دراسي صالح (1-5)";
    }
  }

  return errors;
};

export default validateSignupForm; 