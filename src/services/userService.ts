import axiosInstance from '@/api/axios';
import { AxiosError, isAxiosError } from 'axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { Thread, ValidationErrorResponse } from '@/types';
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
    threads?: Thread[];
    threadsMeta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
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
          message: RESPONSE_MESSAGES.profile.UPDATE_SUCCESS,
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
              message: errorData.message || RESPONSE_MESSAGES.profile.VALIDATION_ERROR,
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
              message: RESPONSE_MESSAGES.profile.DUPLICATE_USERNAME,
              fields: ['username'],
              code: 'DUPLICATE_USERNAME'
            }
          };
        }
      }

      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.profile.UPDATE_FAILED,
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
              message: RESPONSE_MESSAGES.profile.INVALID_PASSWORD,
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
              message: RESPONSE_MESSAGES.profile.SUPER_ADMIN_DELETE,
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
              message: errorData.message || RESPONSE_MESSAGES.profile.VALIDATION_ERROR,
              fields: errorData.fields || (errorData.field ? [errorData.field] : []),
              code: errorData.code || 'VALIDATION_ERROR'
            }
          };
        }
      }

      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.profile.DELETE_FAILED,
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
          message: response.data.message,
          user: response.data.data
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
            message: axiosError.response?.data?.message || RESPONSE_MESSAGES.profile.DEFAULT,
            code: 'SERVER_ERROR'
          }
        };
      }

      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.profile.DEFAULT,
          code: 'SERVER_ERROR'
        }
      };
    }
  },

  async getUserProfileByUsername(
    username: string,
    options?: {
      sort?: 'latest' | 'oldest' | 'most_commented' | 'most_voted';
      page?: number;
      limit?: number;
      category_id?: number;
      includeThreads?: boolean;
      search?: string;
    }
  ): Promise<UserServiceResult> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options?.sort) queryParams.append('sort', options.sort);
      if (options?.page) queryParams.append('page', options.page.toString());
      if (options?.limit) queryParams.append('limit', options.limit.toString());
      if (options?.category_id) queryParams.append('category_id', options.category_id.toString());
      if (options?.includeThreads !== undefined) queryParams.append('includeThreads', options.includeThreads.toString());
      if (options?.search) queryParams.append('search', options.search);

      const queryString = queryParams.toString();
      const url = `/users/${username}${queryString ? `?${queryString}` : ''}`;
      
      const response = await axiosInstance.get(url);
      
      return {
        success: true,
        data: {
          message: response.data.message,
          user: {
            id: response.data.data.id,
            username: response.data.data.username,
            name: response.data.data.name,
            role: response.data.data.role,
            photoPath: response.data.data.photoPath,
            department: response.data.data?.department,
          },
          threads: response.data.data.threads,
          threadsMeta: response.data.data.threadsMeta,
        }
      };
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        return {
          success: false,
          error: {
            message: axiosError.response?.data?.message || RESPONSE_MESSAGES.profile.DEFAULT,
            code: 'SERVER_ERROR'
          }
        };
      }
      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.profile.DEFAULT,
          code: 'SERVER_ERROR'
        }
      };
    }
  }
};
