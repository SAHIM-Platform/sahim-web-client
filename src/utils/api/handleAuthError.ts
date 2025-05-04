import { AuthError } from "@/types";
import ERROR_MESSAGES from '../constants/ERROR_MESSAGES';
import FIELD_ERROR_MAPPING from '../constants/FIELD_ERROR_MAPPING';

/**
 * Generic handler for authentication errors
 * 
 * @param error - The authentication error object
 * @param setGeneralError - Function to set a general error message
 * @param setFieldErrors - Function to set field-specific error messages
 */
export function handleAuthError(
  error: AuthError | undefined,
  setGeneralError: (message: string | null) => void,
  setFieldErrors: (errors: Record<string, string>) => void
): void {
  if (!error) {
    setGeneralError("حدث خطأ غير معروف. يرجى المحاولة مرة أخرى.");
    return;
  }

  const errorCode = error.code || "UNKNOWN_ERROR";
  const messages = ERROR_MESSAGES['login'];
  const fieldMappings = FIELD_ERROR_MAPPING['login'];

  if (errorCode === "VALIDATION_ERROR") {
    if (error.fields && error.fields.length > 0) {
      const fieldErrors: Record<string, string> = {};
      error.fields.forEach(field => {
        fieldErrors[field] = error.message || 'بيانات غير صالحة';
      });
      setFieldErrors(fieldErrors);
    } else {
      setGeneralError(messages.VALIDATION_ERROR);
    }
    return;
  }

  const message = messages[errorCode as keyof typeof messages] || messages.DEFAULT;
  setGeneralError(error.message || message);

  const fieldErrors = fieldMappings[errorCode as keyof typeof fieldMappings] || fieldMappings.DEFAULT;
  if (Object.keys(fieldErrors).length > 0) {
    setFieldErrors(fieldErrors);
  }
}
