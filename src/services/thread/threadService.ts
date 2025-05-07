import { AxiosError, isAxiosError } from 'axios';
import axiosInstance from '@/api/axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import {
  ApiResult,
  ApiResponse,
  Thread,
  CreateThreadPayload,
  UpdateThreadPayload,
  CreateThreadResponse,
} from '@/types';

const handleError = <T>(
  error: unknown,
  fallbackMessage: string
): ApiResult<T> => {
  console.error('API Error:', error);

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; statusCode?: number }>;
    const status = axiosError.response?.status ?? axiosError.response?.data?.statusCode;
    const backendMessage = axiosError.response?.data?.message;

    let message = backendMessage || fallbackMessage;
    let code = 'UNKNOWN_ERROR';

    switch (status) {
      case 400:
        message = RESPONSE_MESSAGES.GLOBAL.VALIDATION_ERROR;
        code = 'VALIDATION_ERROR';
        break;
      case 401:
        message = RESPONSE_MESSAGES.GLOBAL.UNAUTHORIZED;
        code = 'UNAUTHORIZED';
        break;
      case 403:
        message = RESPONSE_MESSAGES.GLOBAL.FORBIDDEN;
        code = 'FORBIDDEN';
        break;
      case 404:
        message = RESPONSE_MESSAGES.GLOBAL.NOT_FOUND;
        code = 'NOT_FOUND';
        break;
      case 409:
        message = backendMessage || RESPONSE_MESSAGES.GLOBAL.CONFLICT;
        code = 'CONFLICT';
        break;
      case 500:
      default:
        code = 'SERVER_ERROR';
    }

    return {
      success: false,
      error: {
        message,
        code,
        status,
      },
    };
  }

  return {
    success: false,
    error: {
      message: fallbackMessage,
      code: 'UNKNOWN_ERROR',
    },
  };
};


export const fetchThreads = async ({
  sort = 'latest',
  page = 1,
  limit = 10,
  category_id,
}: {
  sort?: string;
  page?: number;
  limit?: number;
  category_id?: number;
}): Promise<ApiResult<Thread[]>> => {
  try {
    const params = new URLSearchParams({
      sort,
      page: String(page),
      limit: String(limit),
    });

    if (category_id !== undefined) {
      params.append('category_id', String(category_id));
    }

    const response = await axiosInstance.get<ApiResponse<Thread[]>>(
      `/threads?${params.toString()}`
    );

    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleError<Thread[]>(
      error,
      RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};

export const fetchThreadById = async (
  threadId: number
): Promise<ApiResult<Thread>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Thread>>(
      `/threads/${threadId}?includeComments=true`
    );

    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleError<Thread>(
      error,
      RESPONSE_MESSAGES.thread.NOT_FOUND
    );
  }
};

export const searchThreads = async ({
  query,
  sort = 'latest',
  page = 1,
  limit = 10,
  category_id,
}: {
  query: string;
  sort?: string;
  page?: number;
  limit?: number;
  category_id?: number;
}): Promise<ApiResult<Thread[]>> => {
  try {
    const params = new URLSearchParams({
      query,
      sort,
      page: String(page),
      limit: String(limit),
    });

    if (category_id !== undefined) {
      params.append('category_id', String(category_id));
    }

    const response = await axiosInstance.get<ApiResponse<Thread[]>>(
      `/threads/search?${params.toString()}`
    );

    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleError<Thread[]>(
      error,
      RESPONSE_MESSAGES.search.DEFAULT
    );
  }
};

export const createThread = async (
  payload: CreateThreadPayload
): Promise<ApiResult<CreateThreadResponse>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<CreateThreadResponse>>(
      '/threads',
      payload
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleError<CreateThreadResponse>(
      error,
      RESPONSE_MESSAGES.thread.CREATE_FAILED
    );
  }
};

export const updateThread = async (
  threadId: number,
  payload: UpdateThreadPayload
): Promise<ApiResult<Thread>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<Thread>>(
      `/threads/${threadId}`,
      payload
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleError<Thread>(
      error,
      RESPONSE_MESSAGES.thread.UPDATE_FAILED
    );
  }
};

export const deleteThread = async (
  threadId: number
): Promise<ApiResult<null>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/threads/${threadId}`
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleError<null>(
      error,
      RESPONSE_MESSAGES.thread.DELETE_FAILED
    );
  }
};

export const fetchUserThreads = async ({
  page = 1,
  limit = 10,
  sort = 'latest',
  query = '',
  category_id,
}: {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'most_commented' | 'most_voted';
  query?: string;
  category_id?: number;
} = {}): Promise<ApiResult<Thread[]>> => {
  try {
    const params = new URLSearchParams({
      sort,
      page: String(page),
      limit: String(limit),
    });

    if (query) {
      params.append('search', query);
    }

    if (category_id !== undefined) {
      params.append('category_id', String(category_id));
    }

    const response = await axiosInstance.get<ApiResponse<Thread[]>>(
      `/users/me/threads?${params.toString()}`
    );

    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleError<Thread[]>(
      error,
      RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};
