import axiosInstance from '@/api/axios';
import ERROR_MESSAGES from '@/utils/constants/ERROR_MESSAGES';
import { AxiosError, isAxiosError } from 'axios';

export interface Category {
  category_id: number;
  name: string;
  author_user_id: number;
}

export interface CategoryResponse {
  success: boolean;
  data?: Category[];
  error?: {
    message: string;
    code: string;
  };
}

export const createCategory = async (name: string): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.post<Category>('/admins/categories', { name });
    
    return {
      success: true,
      data: [response.data]
    };
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }
      
      if (axiosError.response?.status === 403) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.FORBIDDEN,
            code: 'FORBIDDEN'
          }
        };
      }
    }
    
    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.category.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const updateCategory = async (categoryId: number, name: string): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.patch<Category>(`/admins/categories/${categoryId}`, { name });
    
    return {
      success: true,
      data: [response.data]
    };
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }
      
      if (axiosError.response?.status === 403) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.FORBIDDEN,
            code: 'FORBIDDEN'
          }
        };
      }
      
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.category.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }
    }
    
    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.category.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const deleteCategory = async (categoryId: number): Promise<CategoryResponse> => {
  try {
    await axiosInstance.delete(`/admins/categories/${categoryId}`);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }
      
      if (axiosError.response?.status === 403) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.FORBIDDEN,
            code: 'FORBIDDEN'
          }
        };
      }
      
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.category.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }
    }
    
    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.category.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}; 