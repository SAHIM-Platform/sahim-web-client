import axiosInstance from '@/api/axios';
import { AdminFormData } from '@/utils/api/admin/validateCreateAdminForm';
import { AxiosError, isAxiosError } from "axios";
import { APIError } from '@/types/api/auth';
import ERROR_MESSAGES from '@/utils/constants/ERROR_MESSAGES';

interface AdminCreationResponse {
  message: string;
}

interface AdminCreationResult {
  success: boolean;
  data?: AdminCreationResponse;
  error?: {
    message: string;
    code: string;
  };
}

async function createAdminService(data: AdminFormData): Promise<AdminCreationResult> {
  try {
    const adminData = {
      email: data.email,
      username: data.username,
      name: data.name,
      password: data.password
    };

    console.log('Sending admin creation request with:', adminData);
    const response = await axiosInstance.post('/admins', adminData);
    console.log('Admin creation response:', response.data);

    return {
      success: true,
      data: {
        message: response.data.message
      }
    };

  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as APIError;
      const statusCode = axiosError.response?.status;

      // Handle specific error cases
      if (statusCode === 400) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.admin.VALIDATION_ERROR,
            code: 'VALIDATION_ERROR'
          }
        };
      }

      if (statusCode === 409) {
        const isEmailConflict = errorData.message?.toLowerCase().includes('email');
        return {
          success: false,
          error: {
            message: isEmailConflict ? ERROR_MESSAGES.admin.DUPLICATE_EMAIL : ERROR_MESSAGES.admin.DUPLICATE_USERNAME,
            code: 'DUPLICATE_USER'
          }
        };
      }

      if (statusCode === 403) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.FORBIDDEN,
            code: 'FORBIDDEN'
          }
        };
      }

      if (statusCode === 401) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }

      // Handle server errors
      if (statusCode && statusCode >= 500) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.admin.SERVER_ERROR,
            code: 'SERVER_ERROR'
          }
        };
      }

      // Handle other API errors
      return {
        success: false,
        error: {
          message: errorData?.message || ERROR_MESSAGES.admin.DEFAULT,
          code: errorData?.error || 'ADMIN_CREATION_ERROR'
        }
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.admin.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}

export default createAdminService; 