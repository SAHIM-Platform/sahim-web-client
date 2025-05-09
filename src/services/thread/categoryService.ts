import axiosInstance from '@/api/axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { handleServiceError } from '@/utils/api/service/handleServiceError';
import {
  ApiResult,
  ApiResponse,
  CategoryResponse,
} from '@/types';

export const fetchCategories = async (): Promise<ApiResult<CategoryResponse[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<CategoryResponse[]>>(
      '/threads/categories'
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleServiceError<CategoryResponse[]>(
      error,
      RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};
