import { BookmarkedThreadsResult, BookmarkResult, ThreadResponse, ValidationErrorResponse } from "@/types";
import { AxiosError, isAxiosError } from "axios";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { THREADS_LIMIT } from "@/utils/constants/ITEMS_LIMITS";
import axiosInstance from "@/api/axios";

export const bookmarkThread = async (threadId: number): Promise<BookmarkResult> => {
  try {
    const response = await axiosInstance.post(`/threads/${threadId}/bookmark`);

    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message
      };
    }

    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  } catch (error) {
    console.error('Error bookmarking thread:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 403) {
        const message = (axiosError.response.data as { message?: string })?.message ?? 'Forbidden';
        return {
          success: false,
          message,
          error: 'FORBIDDEN'
        };
      }

      if (axiosError.response?.status === 401) {
        throw new Error(RESPONSE_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  }
};

export const unbookmarkThread = async (threadId: number): Promise<BookmarkResult> => {
  try {
    const response = await axiosInstance.delete(`/threads/${threadId}/bookmark`);

    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message
      };
    }

    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  } catch (error) {
    console.error('Error unbookmarking thread:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 403) {
        const message = (axiosError.response.data as { message?: string })?.message ?? 'Forbidden';
        return {
          success: false,
          message,
          error: 'FORBIDDEN'
        };
      }

      if (axiosError.response?.status === 401) {
        throw new Error(RESPONSE_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  }
};

export const fetchBookmarkedThreads = async ({
  sort = "latest",
  page = 0,
  limit = THREADS_LIMIT,
}: {
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<BookmarkedThreadsResult> => {

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });
  try {
    const response = await axiosInstance.get<ThreadResponse>(`/users/me/bookmarks?${params}`);

    if (response.data && response.data.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR',
      },
    };
  } catch (error) {
    console.error('Error fetching bookmarked threads:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Handle validation errors
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as ValidationErrorResponse;
        return {
          success: false,
          error: {
            message: errorData.message || RESPONSE_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR',
          },
        };
      }

      // Handle unauthorized errors
      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED',
          },
        };
      }

      // Handle not found errors
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND',
          },
        };
      }

      // Handle server errors
      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.thread.SERVER_ERROR,
          code: 'SERVER_ERROR',
        },
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR',
      },
    };
  }
};