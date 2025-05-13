import axiosInstance from '@/api/axios';
import { Admin } from '@/types';
import { AxiosError, isAxiosError } from 'axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';

interface AdminResponse {
  id: number;
  name: string;
  username: string;
  created_at: string;
}

interface AdminsResult {
  success: boolean;
  data?: Admin[];
  error?: {
    message: string;
    code: string;
  };
}

interface DeleteResult {
  success: boolean;
  error?: {
    message: string;
    code: string;
  };
}

export const adminService = {
  async getAdmins(): Promise<AdminsResult> {
    try {
      const response = await axiosInstance.get('/admins');
      console.log('API Response:', response.data);

      const admins: Admin[] = response.data.data.map((admin: AdminResponse) => ({
        id: admin.id,
        name: admin.name,
        username: admin.username,
        created_at: admin.created_at,
      }));

      return {
        success: true,
        data: admins,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response?.status === 401) {
          return {
            success: false,
            error: {
              message: RESPONSE_MESSAGES.auth.UNAUTHORIZED,
              code: 'UNAUTHORIZED'
            }
          };
        }
        
        if (axiosError.response?.status === 403) {
          return {
            success: false,
            error: {
              message: RESPONSE_MESSAGES.auth.FORBIDDEN,
              code: 'FORBIDDEN'
            }
          };
        }
      }
      
      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.thread.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }
  },

  async deleteAdmin(id: number): Promise<DeleteResult> {
    try {
      await axiosInstance.delete(`/admins/${id}`);
      return { success: true };
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response?.status === 401) {
          return {
            success: false,
            error: {
              message: RESPONSE_MESSAGES.auth.UNAUTHORIZED,
              code: 'UNAUTHORIZED'
            }
          };
        }
        
        if (axiosError.response?.status === 403) {
          return {
            success: false,
            error: {
              message: RESPONSE_MESSAGES.auth.FORBIDDEN,
              code: 'FORBIDDEN'
            }
          };
        }

        if (axiosError.response?.status === 404) {
          return {
            success: false,
            error: {
              message: RESPONSE_MESSAGES.adminListing.NOT_FOUND,
              code: 'NOT_FOUND'
            }
          };
        }
      }
      
      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.adminListing.DELETE_FAILED,
          code: 'SERVER_ERROR'
        }
      };
    }
  },
}; 