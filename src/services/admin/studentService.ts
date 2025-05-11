import axiosInstance from '@/api/axios';
import { Student, ApprovalStatus, ApiError, ValidationErrorResponse } from '@/types';
import { AxiosError, isAxiosError } from 'axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';

export interface StudentsResponse {
  data: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface StudentError {
  message: string;
  code: string;
}

export interface StudentResult {
  success: boolean;
  data?: StudentsResponse;
  error?: StudentError;
}

export interface StudentFilters {
  status?: ApprovalStatus;
  search?: string;
}

export const fetchStudents = async (filters?: StudentFilters): Promise<StudentResult> => {
  try {
    console.log('Fetching students with filters:', filters);

    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const queryString = params.toString();
    const url = `/admins/users/students${queryString ? `?${queryString}` : ''}`;
    console.log('Fetch URL:', url);

    const response = await axiosInstance.get<StudentsResponse>(url);

    console.log('stedents fetch response:', {
      status: response.status,
      data: response.data
    });

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('students fetching error:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as ValidationErrorResponse;
        return {
          success: false,
          error: {
            message: errorData.message || RESPONSE_MESSAGES.student.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.student.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export interface StudentActionResult {
  success: boolean;
  message?: string;
  error?: {
    message: string;
    code: string;
  };
}

export const approveStudent = async (studentId: number): Promise<StudentActionResult> => {
  try {
    const response = await axiosInstance.patch(`/admins/students/${studentId}/approve`);
    
    if (response.status === 200) {
      return { 
        success: true,
        message: response.data.message || 'Student approved successfully'
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Error approving student:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as ApiError;
        return {
          success: false,
          error: {
            message: errorData.error?.message || RESPONSE_MESSAGES.student.VALIDATION_ERROR,
            code: errorData.error?.code || 'VALIDATION_ERROR'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const rejectStudent = async (studentId: number): Promise<StudentActionResult> => {
  try {
    const response = await axiosInstance.patch(`/admins/students/${studentId}/reject`);
    
    if (response.status === 200) {
      return { 
        success: true,
        message: response.data.message || 'Student rejected successfully'
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Error rejecting student:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as ApiError;
        return {
          success: false,
          error: {
            message: errorData.error?.message || RESPONSE_MESSAGES.student.VALIDATION_ERROR,
            code: errorData.error?.code || 'VALIDATION_ERROR'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}; 