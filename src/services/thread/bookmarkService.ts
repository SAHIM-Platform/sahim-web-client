import axiosInstance from '@/api/axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { handleServiceError } from '@/utils/api/service/handleServiceError';
import {
  ApiResult,
  ApiResponse,
  Thread,
} from '@/types';

// Bookmark a thread
export const bookmarkThread = async (
  threadId: number
): Promise<ApiResult<null>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      `/threads/${threadId}/bookmark`
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleServiceError<null>(
      error,
      RESPONSE_MESSAGES.BOOKMARK.ADD_FAILED || RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};

// Unbookmark a thread
export const unbookmarkThread = async (
  threadId: number
): Promise<ApiResult<null>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/threads/${threadId}/bookmark`
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleServiceError<null>(
      error,
      RESPONSE_MESSAGES.BOOKMARK.REMOVE_FAILED || RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};

// Fetch bookmarked threads
export const fetchBookmarkedThreads = async ({
  sort = 'latest',
  page = 1,
  limit = 10,
}: {
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResult<Thread[]>> => {
  try {
    const params = new URLSearchParams({
      sort,
      page: String(page),
      limit: String(limit),
    });

    const response = await axiosInstance.get<ApiResponse<Thread[]>>(
      `/users/me/bookmarks?${params.toString()}`
    );

    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleServiceError<Thread[]>(
      error,
      RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};