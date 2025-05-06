import { CreateThreadResult, DeleteThreadResult, ThreadResponse, ThreadServiceResult } from "@/types";
import { ThreadResult, SingleThreadResult, Thread, ValidationErrorResponse } from "@/types";
import axiosInstance from "@/api/axios";
import { THREADS_LIMIT } from "@/utils/constants/ITEMS_LIMITS";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { AxiosError, isAxiosError } from "axios";

export const fetchThreads = async ({
  sort = "latest",
  page = 0,
  limit = THREADS_LIMIT,
  category_id,
}: {
  sort?: string;
  page?: number;
  limit?: number;
  category_id?: number;
}): Promise<ThreadResult> => {
  try {
    console.log("inside fetch threads")

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
    });

    if (category_id !== undefined) {
      params.append("category_id", String(category_id));
    }

    const response = await axiosInstance.get<ThreadResponse>(`/threads?${params.toString()}`);

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Thread fetching error:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      if (status === 400) {
        const errorData = axiosError.response?.data as ValidationErrorResponse;
        return {
          success: false,
          error: {
            message: errorData.message || RESPONSE_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      if (status === 404) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }

      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.thread.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const fetchThreadById = async (threadId: number): Promise<SingleThreadResult> => {
  try {
    const response = await axiosInstance.get<Thread>(`/threads/${threadId}?includeComments=true`);

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Thread fetching error:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Handle validation errors
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as ValidationErrorResponse;
        return {
          success: false,
          error: {
            message: errorData.message || RESPONSE_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      // Handle not found errors
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }

      // Handle server errors
      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.thread.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const searchThreads = async ({
  query,
  sort = "latest",
  page = 0,
  limit = THREADS_LIMIT,
  category_id,
}: {
  query?: string;
  sort?: string;
  page?: number;
  limit?: number;
  category_id?: number;
}): Promise<ThreadResult> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      query: encodeURIComponent(query ?? ''),
    });

    if (category_id !== undefined) {
      params.append("category_id", String(category_id));
    }

    const response = await axiosInstance.get<ThreadResponse>(`/threads/search?${params.toString()}`);

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Search failed:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      if (status === 400) {
        const errorData = axiosError.response?.data as ValidationErrorResponse;
        return {
          success: false,
          error: {
            message: errorData.message || RESPONSE_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      if (status === 404) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }

      return {
        success: false,
        error: {
          message: RESPONSE_MESSAGES.thread.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};
export const updateThread = async (
  threadId: number, 
  threadData: {
    title: string;
    content: string;
    category_id: number;
    thumbnail_url?: string | null;
  }
): Promise<SingleThreadResult> => {
  try {
    const response = await axiosInstance.patch<Thread>(`/threads/${threadId}`, threadData);

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Thread update error:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data as ValidationErrorResponse;
        return {
          success: false,
          error: {
            message: errorData.message || RESPONSE_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

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
            message: RESPONSE_MESSAGES.thread.FORBIDDEN,
            code: 'FORBIDDEN'
          }
        };
      }

      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const createThread = async (threadData: {
  title: string;
  content: string;
  category_id: number;
  thumbnail_url?: string | null;
}): Promise<CreateThreadResult> => {
  try {
    const response = await axiosInstance.post<{ thread_id: number }>('/threads', threadData);

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  } catch (error) {
    console.error('Error creating thread:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 400) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.VALIDATION_ERROR,
            code: 'VALIDATION_ERROR'
          }
        };
      }

      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const deleteThread = async (threadId: number): Promise<DeleteThreadResult> => {
  try {
    await axiosInstance.delete(`/threads/${threadId}`);
    return {
      success: true
    };
  } catch (error) {
    console.error('Thread deletion error:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Handle unauthorized errors
      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }

      // Handle forbidden errors (e.g., trying to delete someone else's thread)
      if (axiosError.response?.status === 403) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.FORBIDDEN,
            code: 'FORBIDDEN'
          }
        };
      }

      // Handle not found errors
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: RESPONSE_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const fetchUserThreads = async ({
  page = 1,
  limit = 10,
  sort = 'latest',
  query = '',
  category_id
}: {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'most_commented' | 'most_voted';
  query?: string;
  category_id?: number;
} = {}): Promise<ThreadServiceResult> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort
    });

    if (query) {
      params.append('search', query);
    }

    if (category_id !== undefined) {
      params.append('category_id', String(category_id));
    }

    const response = await axiosInstance.get(`/users/me/threads?${params}`);
    return {
      success: true,
      data: {
        data: response.data.data,
        meta: response.data.meta
      }
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        error: {
          message: axiosError.response?.data?.message || RESPONSE_MESSAGES.thread.DEFAULT,
          code: 'SERVER_ERROR'
        }
      };
    }

    return {
      success: false,
      error: {
        message: RESPONSE_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};