export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  autoComplete?: string;
  error?: string;
}

export interface FormTitle {
  text: string;
}

export interface FormData {
  title: FormTitle;
  description?: string;
  fields: FormField[];
  submitButton: {
    text: string;
    className?: string;
  };
  submitText?: string;
  error?: string;
}

export interface ValidationErrorResponse {
	message?: string;
	fields?: string[];
	field?: string;
	code?: string;
}