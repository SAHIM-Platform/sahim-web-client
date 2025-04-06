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
  } else if (values.name.length < 3){
    errors.name = "الاسم يجب ان 3 أحرف على الأقل";
  } else if (values.name.length > 100){
    errors.name = "الاسم يجب ان لا يتجاوز 100 حرف";
  }

  // Academic number validation
  if (!values.academicNumber?.trim()) {
    errors.academicNumber = "الرقم الأكاديمي مطلوب";
  } else if (values.academicNumber.length != 13){
    errors.academicNumber = "الرقم الأكاديمي يجب أن يتكون من 13 رقم"
  } else if (!/^\d[0-9]$/.test(values.academicNumber)) {
    errors.academicNumber = "الرقم الأكاديمي يجب أن يتكون من أرقام صحيحة فقط";
  }

  // Email validation
  if (!values.email?.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "البريد الإلكتروني غير صالح";
  } else if (values.email.length > 255){
    errors.name = "البريد الإلكتروني يجب ان لا يتجاوز 255 حرف";
  }

  // Username validation
  if (!values.username?.trim()) {
    errors.username = "اسم المستخدم مطلوب";
  } else if (values.username.length < 3) {
    errors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
  } else if (values.username.length > 50){
    errors.username = "اسم المستخدم يجب ان لا يتجاوز 50 حرف";
  } else if(!/^[a-zA-Z0-9_-]+$/.test(values.username)){
    errors.username = "اسم المستخدم يمكن أن يحتوي على حروف إنجليزية، أرقام، شرطات سفلية _ ، وشرطات فقط";
  }

  // Password validation
  if (!values.password?.trim()) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (values.password.length < 8) {
    errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  } else if (values.password.length > 72){
    errors.password = "كلمة المرور يجب ان لا يتجاوز 72 حرف";
  } else if (!/[A-Z]/.test(values.password)){
    errors.password = "كلمة المرور يجب ان تحتوى حرف واحد كبير على الأقل";
  } else if (!/[a-z]/.test(values.password)){
    errors.password = "كلمة المرور يجب ان تحتوى حرف واحد صغير على الأقل";
  } else if (!/[0-9]/.test(values.password)){
    errors.password = "كلمة المرور يجب ان تحتوى على رقم رقم واحد على الأقل";
  } else if(!/[@$!%*?&]/.test(values.password)){
    errors.password = "(@$!%*?&)كلمة المرور يجب ان تحتوى على رموز خاصة";
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
  } else if(!(values.department in Department)){
    errors.department = "يرجى إدخال القسم بشكل صحيح ويتطابق مع القيم المتاحة";
  }

  // Study level validation
  if (!values.studyLevel) {
    errors.studyLevel = "المستوى الدراسي مطلوب";
  } else if (!(values.studyLevel in Level)){
    errors.studyLevel = "يجب ان يكون المستوى بين 1-5";
  }

  return errors;
};

export default validateSignupForm; 