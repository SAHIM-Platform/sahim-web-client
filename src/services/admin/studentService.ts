import axiosInstance from '@/api/axios';
import { Student, ApprovalStatus, APIError, ValidationErrorResponse } from '@/types';
import { AxiosError, isAxiosError } from 'axios';
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';

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

export const fetchStudents = async (status?: ApprovalStatus): Promise<StudentResult> => {
  try {
    console.log('Fetching students with status:', status);

    const url = status ? `/admins/users/students?status=${status}` : '/admins/users/students';
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
        message: ERROR_MESSAGES.student.DEFAULT,
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
            message: errorData.message || ERROR_MESSAGES.student.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.student.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export interface SearchFilters {
  status?: ApprovalStatus;
  query?: string;
}

export const searchStudents = async (filters: SearchFilters): Promise<Student[]> => {
  try {
    console.log('Searching students with filters:', filters);

    // If only status is provided, use fetchStudents instead
    if (filters.status && !filters.query) {
      const result = await fetchStudents(filters.status);
      if (!result.success || !result.data) {
        throw new Error(result.error?.message || ERROR_MESSAGES.search.DEFAULT);
      }
      return result.data.data;
    }

    // If search query is provided, use the search endpoint
    const params = new URLSearchParams();
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.query) {
      params.append('query', filters.query);
    }

    const url = `/admins/users/students/search?${params.toString()}`;
    console.log('Search URL:', url);

    const response = await axiosInstance.get<Student[]>(url);

    console.log('Search response:', {
      status: response.status,
      data: response.data,
      filtersApplied: filters
    });

    if (!response.data) {
      throw new Error(ERROR_MESSAGES.search.DEFAULT);
    }

    return response.data;
  } catch (error) {
    console.error('Search failed:', {
      error,
      filters,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
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
        message: ERROR_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Error approving student:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as APIError;
        return {
          success: false,
          error: {
            message: errorData.message || ERROR_MESSAGES.student.VALIDATION_ERROR,
            code: errorData.error || 'VALIDATION_ERROR'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.student.DEFAULT,
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
        message: ERROR_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Error rejecting student:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as APIError;
        return {
          success: false,
          error: {
            message: errorData.message || ERROR_MESSAGES.student.VALIDATION_ERROR,
            code: errorData.error || 'VALIDATION_ERROR'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.student.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
}; 