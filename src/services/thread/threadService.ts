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
import { handleServiceError } from '@/utils/api/service/handleServiceError';

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
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<Thread[]>(
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
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<Thread>(
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
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<Thread[]>(
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
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<CreateThreadResponse>(
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
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<Thread>(
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
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<null>(
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
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<Thread[]>(
      error,
      RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};
