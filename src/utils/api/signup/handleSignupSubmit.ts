import { AxiosInstance, AxiosError } from 'axios';
import { SignupFormData } from './validateSignupForm';
import { AuthResult, APIError } from '@/types/auth';
import ERROR_MESSAGES from '../ERROR_MESSAGES';

export const handleSignupSubmit = async (
  axiosInstance: AxiosInstance,
  values: SignupFormData,
  setErrors: (errors: Record<string, string>) => void,
  setFormError: (error: string | null) => void,
  setIsLoading: (isLoading: boolean) => void,
): Promise<AuthResult | undefined> => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Raw signup values:', values);
  }

  const signupData = {
    email: values.email.trim(),
    username: values.username.trim(),
    password: values.password,
    name: values.name.trim(),
    academicNumber: values.academicNumber,
    department: values.department,
    studyLevel: Number(values.studyLevel)
  };

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending signup request to:', '/auth/signup');
    }
    const response = await axiosInstance.post<AuthResult>('/auth/signup', signupData);
    if (process.env.NODE_ENV === 'development') {
      console.log('Signup response:', response.data);
    }
    
    if (response.data.success && response.data.data) {
      return response.data;
    } else {
      if (response.data.error?.fields) {
        const fieldErrors = response.data.error.fields.reduce<Record<string, string>>((acc, field) => ({
          ...acc,
          [field]: response.data.error?.message || ERROR_MESSAGES.signup.VALIDATION_ERROR
        }), {});
        setErrors(fieldErrors);
      }
      setFormError(response.data.error?.message || ERROR_MESSAGES.signup.DEFAULT);
      return response.data;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Signup error details:', {
        status: (error as AxiosError<APIError>)?.response?.status,
        data: (error as AxiosError<APIError>)?.response?.data,
        error: (error as Error).message
      });
    }

    const errorMessage = (error as AxiosError<APIError>)?.response?.data?.message || ERROR_MESSAGES.signup.SERVER_ERROR;
    setFormError(errorMessage);
    return {
      success: false,
      error: {
        message: errorMessage
      }
    };
  } finally {
    setIsLoading(false);
  }
};

export default handleSignupSubmit; 