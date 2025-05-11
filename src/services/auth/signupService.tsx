import axiosInstance from '@/api/axios';
import { AuthError, AuthResult } from "@/types";
import { AxiosError, isAxiosError } from "axios";
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { ValidationErrorResponse } from '@/types';
import { AuthMethod, SignupFormData } from '@/utils/api/signup/validateSignupForm';

async function signupService(data: SignupFormData): Promise<AuthResult> {
  console.log("Signup data: ", data)
  try {
    const signupData = {
      username: data.username.trim(),
      ...((!data.authMethod || data.authMethod === AuthMethod.EMAIL_PASSWORD) && { 
        password: data.password 
      }),
      ...((data.authMethod === AuthMethod.OAUTH_GOOGLE) && {
        email: data.email
      }),
      name: data.name.trim(),
      authMethod: data.authMethod,
      academicNumber: data.academicNumber,
      department: data.department,
      studyLevel: Number(data.studyLevel),
    };

    console.log('Sending signup request with:', signupData);
    const response = await axiosInstance.post('/auth/signup', signupData);
    console.log('Signup response:', response.data);

    // Check if we have the required data
    if (response.data?.data?.accessToken && response.data?.data?.user) {
      return {
        success: true,
        data: {
          message: response.data.message,
          accessToken: response.data.data.accessToken,
          user: response.data.data.user
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
            message: errorData.message || RESPONSE_MESSAGES.signup.VALIDATION_ERROR,
            fields: errorData.fields || (errorData.field ? [errorData.field] : []),
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      // Handle duplicate username errors
      if (axiosError.response?.status === 409) {
        const errorData = axiosError.response.data as AuthError;

        return {
          success: false,
          error: {
            message: errorData.message || RESPONSE_MESSAGES.signup.DUPLICATE_USER,
            fields: ['username'],
            code: errorData.code || 'DUPLICATE_USER'
          }
        };
      }

      // Handle server errors
      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.signup.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.signup.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}

export default signupService; 