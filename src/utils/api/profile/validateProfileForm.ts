/**
 * Validates the profile update form input.
 * @param values - Form values to validate.
 * @returns An object containing validation errors, if any.
 */
const validateProfileForm = (
  values: Record<string, string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Name validation
  if (values.name) {
    if (values.name.length < 3) {
      errors.name = "يجب أن يتكون الاسم من 3 أحرف على الأقل";
    } else if (values.name.length > 100) {
      errors.name = "يجب أن لا يتجاوز الاسم 100 حرف";
    }
  }

  // Photo URL validation (if provided)
  if (values.photoPath && values.photoPath.trim()) {
    const photoUrlRegex = /^(https?:\/\/.*\.(jpg|jpeg|png|webp)|(\/)?public\/avatars\/defaults\/.*\.(jpg|jpeg|png|webp))$/i;
    if (!photoUrlRegex.test(values.photoPath)) {
      errors.photoPath = "يجب أن يكون الرابط صالحاً (http/https) أو يبدأ بـ public/avatars/defaults/ وينتهي بـ .jpg أو .jpeg أو .png أو .webp";
    }
  }

  return errors;
};

export default validateProfileForm; 