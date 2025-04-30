export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'select';
  label: string;
  required?: boolean;
  helperText?: string;
  autoComplete?: string;
  placeholder: string;
  error?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface FormTitle {
  text: string;
}

export interface FormButton {
  text: string;
}

export interface FormData {
  submitButton: FormButton;
  fields: FormField[];
}

export interface FormDataHeading {
  title: FormTitle;
  description: string;
}

export interface ValidationErrorResponse {
	message?: string;
	fields?: string[];
	field?: string;
	code?: string;
}