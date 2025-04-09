import axiosInstance from '@/api/axios';
import { AuthError, AuthResult } from "@/types/auth";
import { AxiosError, isAxiosError } from "axios";
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';
import { ValidationErrorResponse } from '@/types';
import { SignupFormData } from '@/utils/api/signup/validateSignupForm';

async function signupService(data: SignupFormData): Promise<AuthResult> {
  try {
    const signupData = {
      email: data.email.trim(),
      username: data.username.trim(),
      password: data.password,
      name: data.name.trim(),
      academicNumber: data.academicNumber,
      department: data.department,
      studyLevel: Number(data.studyLevel)
    };

    console.log('Sending signup request with:', signupData);
    const response = await axiosInstance.post('/auth/signup', signupData);
    console.log('Signup response:', response.data);

    // there is accessToken? consider it success
    if (response.data && response.data.accessToken) {
      return {
        success: true,
        data: {
          message: response.data.message,
          accessToken: response.data.accessToken,
          user: response.data.user
        }
      };
    } else {
      // no accessToken? consider it failure
      return {
        success: false,
        error: {
          message: 'Signup failed.',
          code: 'AUTH_FAILED'
        }
      };
    }

  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Handle validation errors
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as ValidationErrorResponse;

        return {
          success: false,
          error: {
            message: errorData.message || ERROR_MESSAGES.signup.VALIDATION_ERROR,
            fields: errorData.fields || (errorData.field ? [errorData.field] : []),
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      // Handle duplicate email/username errors
      if (axiosError.response?.status === 409) {
        const errorData = axiosError.response.data as AuthError;
        const field = errorData.message?.toLowerCase().includes('email') ? 'email' : 'username';

        return {
          success: false,
          error: {
            message: errorData.message || ERROR_MESSAGES.signup.DUPLICATE_USER,
            fields: [field],
            code: errorData.code || 'DUPLICATE_USER'
          }
        };
      }

      // Handle server errors
      return {
        success: false,
        error: {
          message: ERROR_MESSAGES.signup.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.signup.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}

export default signupService; 