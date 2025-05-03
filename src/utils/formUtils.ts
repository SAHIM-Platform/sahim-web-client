/**
 * Clears a specific field error from the field errors object
 * @param fieldErrors Current field errors object
 * @param field Field to clear error for
 * @returns New field errors object with the specified field error removed
 */
export const clearFieldError = (
  fieldErrors: Record<string, string>,
  field: string
): Record<string, string> => {
  if (!fieldErrors[field]) return fieldErrors;
  
  const newErrors = { ...fieldErrors };
  delete newErrors[field];
  return newErrors;
}; 