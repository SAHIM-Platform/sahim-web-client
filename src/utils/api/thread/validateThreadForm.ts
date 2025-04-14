/**
 * Validates the thread creation form input.
 * @param values - Form values to validate.
 * @returns An object containing validation errors, if any.
 */
const validateThreadForm = (
  values: Record<string, string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Title validation
  if (!values.title) {
    errors.title = "عنوان المناقشة مطلوب";
  } else if (values.title.length < 5) {
    errors.title = "يجب أن يتكون العنوان من 5 أحرف على الأقل";
  }

  // Content validation
  if (!values.content) {
    errors.content = "محتوى المناقشة مطلوب";
  } else if (values.content.length < 10) {
    errors.content = "يجب أن يتكون المحتوى من 10 أحرف على الأقل";
  }

  // Category validation
  if (!values.category_id) {
    errors.category_id = "تصنيف المناقشة مطلوب";
  }

  return errors;
};

export default validateThreadForm; 