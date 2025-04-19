import axiosInstance from '@/api/axios';
import { AxiosError, isAxiosError } from 'axios';
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';
import { ValidationErrorResponse } from '@/types';
import { Profile } from '@/types';

export interface UpdateProfileData {
  name?: string;
  username?: string;
  photo_path?: string;
}

export interface DeleteProfileData {
  password: string;
}

export interface UserServiceResult {
  success: boolean;
  data?: {
    message: string;
    user?: Profile;
  };
  error?: {
    message: string;
    code: string;
    fields?: string[];
  };
}

interface ErrorResponse {
  message?: string;
  code?: string;
}

export const userService = {
  async updateProfile(data: UpdateProfileData): Promise<UserServiceResult> {
    try {
      const response = await axiosInstance.patch('/users/me', data);
      console.log('Update Profile Response:', response.data);
      
      return {
        success: true,
        data: {
          message: ERROR_MESSAGES.profile.UPDATE_SUCCESS,
          user: response.data
        }
      };
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        // Handle validation errors
        if (axiosError.response?.status === 400) {
          const errorData = axiosError.response.data as ValidationErrorResponse;
          return {
            success: false,
            error: {
              message: errorData.message || ERROR_MESSAGES.profile.VALIDATION_ERROR,
              fields: errorData.fields || (errorData.field ? [errorData.field] : []),
              code: errorData.code || 'VALIDATION_ERROR'
            }
          };
        }

        // Handle duplicate username
        if (axiosError.response?.status === 409) {
          return {
            success: false,
            error: {
              message: ERROR_MESSAGES.profile.DUPLICATE_USERNAME,
              fields: ['username'],
              code: 'DUPLICATE_USERNAME'
            }
          };
        }
      }

      return {
        success: false,
        error: {
          message: ERROR_MESSAGES.profile.UPDATE_FAILED,
          code: 'UPDATE_FAILED'
        }
      };
    }
  },

  async deleteProfile(data: DeleteProfileData): Promise<UserServiceResult> {
    try {
      const response = await axiosInstance.delete('/users/me', { data });
      console.log('Delete Profile Response:', response.data);
      
      return {
        success: true,
        data: {
          message: response.data.message
        }
      };
    } catch (error) {
      console.error('Delete Profile Error:', error);
      
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        // Handle invalid password
        if (axiosError.response?.status === 401) {
          return {
            success: false,
            error: {
              message: ERROR_MESSAGES.profile.INVALID_PASSWORD,
              fields: ['password'],
              code: 'INVALID_PASSWORD'
            }
          };
        }

        // Handle super admin deletion attempt
        if (axiosError.response?.status === 403) {
          return {
            success: false,
            error: {
              message: ERROR_MESSAGES.profile.SUPER_ADMIN_DELETE,
              code: 'SUPER_ADMIN_DELETE'
            }
          };
        }

        // Handle validation errors
        if (axiosError.response?.status === 400) {
          const errorData = axiosError.response.data as ValidationErrorResponse;
          return {
            success: false,
            error: {
              message: errorData.message || ERROR_MESSAGES.profile.VALIDATION_ERROR,
              fields: errorData.fields || (errorData.field ? [errorData.field] : []),
              code: errorData.code || 'VALIDATION_ERROR'
            }
          };
        }
      }

      return {
        success: false,
        error: {
          message: ERROR_MESSAGES.profile.DELETE_FAILED,
          code: 'DELETE_FAILED'
        }
      };
    }
  },

  async getProfile(): Promise<UserServiceResult> {
    try {
      const response = await axiosInstance.get('/users/me');
      console.log('Profile Response:', response.data);
      
      return {
        success: true,
        data: {
          message: ERROR_MESSAGES.profile.FETCH_SUCCESS,
          user: response.data
        }
      };
    } catch (error) {
      console.error('Profile Error:', error);
      
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.error('Axios Error Details:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message
        });
        
        return {
          success: false,
          error: {
            message: axiosError.response?.data?.message || ERROR_MESSAGES.profile.DEFAULT,
            code: 'SERVER_ERROR'
          }
        };
      }

      return {
        success: false,
        error: {
          message: ERROR_MESSAGES.profile.DEFAULT,
          code: 'SERVER_ERROR'
        }
      };
    }
  }
}; 