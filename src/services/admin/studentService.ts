import axiosInstance from '@/api/axios';
import { Student, ApprovalStatus } from '@/types';
import { Department } from '@/types';
import { AxiosError, isAxiosError } from 'axios';
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';

interface StudentResponse {
  id: number;
  name: string;
  email: string;
  student: {
    id: number;
    userId: number;
    academicNumber: string;
    department: Department;
    studyLevel: number;
    approvalStatus: ApprovalStatus;
    approvalUpdatedByUserId: number | null;
  };
}

interface StudentsResult {
  success: boolean;
  data?: Student[];
  error?: {
    message: string;
    code: string;
  };
}

export const fetchStudents = async (
  status?: ApprovalStatus
): Promise<StudentsResult> => {
  try {
    const response = await axiosInstance.get<StudentResponse[]>(
      `/admins/users/students${status ? `?status=${status}` : ""}`
    );

    const students: Student[] = response.data.map((user: StudentResponse) => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      academicNumber: user.student.academicNumber,
      department: user.student.department,
      level: user.student.studyLevel,
      approvalStatus: user.student.approvalStatus,
      createdAt: new Date().toISOString(), // These fields are not in the API response
      updatedAt: new Date().toISOString(), // These fields are not in the API response
    }));

    return {
      success: true,
      data: students,
    };
  } catch (error) {
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
        message: ERROR_MESSAGES.thread.SERVER_ERROR,
        code: 'SERVER_ERROR'
      }
    };
  }
}; 