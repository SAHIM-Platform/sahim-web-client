/**
 * Validates the login form input.
 * @param values - Form values to validate.
 * @returns An object containing validation errors, if any.
 */
const validateLoginForm = (
  values: Record<string, string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.email) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }

  if (!values.password) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (values.password.length < 6) {
    errors.password = "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
  }

  return errors;
};

export default validateLoginForm;
