/**
 * Validates the login form input.
 * @param values - Form values to validate.
 * @returns An object containing validation errors, if any.
 */
const validateLoginForm = (
  values: Record<string, string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.identifier) {
    errors.identifier = "اسم المستخدم أو الرقم الأكاديمي مطلوب";
  } else if (values.identifier.length < 3) {
    errors.identifier = "يجب أن يكون اسم المستخدم أو الرقم الأكاديمي 3 أحرف على الأقل";
  }

  if (!values.password) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (values.password.length < 6) {
    errors.password = "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
  }

  return errors;
};

export default validateLoginForm;
