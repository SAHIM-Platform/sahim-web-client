import axiosInstance from '@/api/axios';
import { ThreadResult, ThreadResponse, SingleThreadResult, Thread } from '@/types/thread';
import { AxiosError, isAxiosError } from 'axios';
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';
import { ValidationErrorResponse } from '@/types';

interface VoteResponse {
  success: boolean;
  votesCount: number;
  userVote: "UP" | "DOWN" | null;
}

interface APIVoteResponse {
  success: boolean;
  updatedVotes: {
    score?: number;
    user_vote?: "UP" | "DOWN" | null;
  };
}

interface CategoryResponse {
  data: {
    category_id: number;
    name: string;
  }[];
}

type CommentResponse = {
  id: number;
  content: string;
  thread_id: number;
  author_user_id: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    name: string | null;
  };
  votes: {
    score: number; // Upvotes - Downvotes
    user_vote: 'UP' | 'DOWN' | null; // The current user's vote
    counts: {
      up: number; // Number of upvotes
      down: number; // Number of downvotes
    };
  };
};


export async function voteThread(threadId: number, voteType: "UP" | "DOWN"): Promise<VoteResponse> {
  try {
    console.log("threadId ", threadId)
    console.log("voteType ", voteType)
    const response = await axiosInstance.post<APIVoteResponse>(`/threads/${threadId}/vote`, {
      vote_type: voteType
    });
    
    console.log("voteThread response ", response)

    // Validate response data structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error(ERROR_MESSAGES.thread.VALIDATION_ERROR);
    }

    const { success, updatedVotes } = response.data;

    // Validate required fields
    if (typeof success !== 'boolean' || !updatedVotes) {
      throw new Error(ERROR_MESSAGES.thread.VALIDATION_ERROR);
    }

    // Return transformed data
    return {
      success,
      votesCount: updatedVotes.score ?? 0,
      userVote: updatedVotes.user_vote ?? null
    };
  } catch (error) {
    console.error('Error voting on thread:', error);
    
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        throw new Error(ERROR_MESSAGES.auth.UNAUTHORIZED);
      }
      
      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.thread.NOT_FOUND);
      }
      
      if (axiosError.response?.status === 400) {
        throw new Error(ERROR_MESSAGES.thread.VALIDATION_ERROR);
      }
    }
    
    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
  }
}

export async function createComment(threadId: number, content: string): Promise<CommentResponse> {
  try {
    const response = await axiosInstance.post<CommentResponse>(`/threads/${threadId}/comments`, {
      content
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
  } catch (error) {
    console.error('Error creating comment:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 400) {
        throw new Error(ERROR_MESSAGES.thread.VALIDATION_ERROR);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
  }
}


export async function updateComment(
  threadId: number,
  commentId: number,
  content: string
): Promise<CommentResponse> {
  try {
    const response = await axiosInstance.put<CommentResponse>(
      `/threads/${threadId}/comments/${commentId}`,
      { content }
    );

    if (response.data) {
      return response.data;
    }

    throw new Error(ERROR_MESSAGES.comment.DEFAULT);
  } catch (error) {
    console.error('Error updating comment:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 400) {
        throw new Error(ERROR_MESSAGES.comment.VALIDATION_ERROR);
      }

      if (axiosError.response?.status === 401) {
        throw new Error(ERROR_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.comment.NOT_FOUND);
      }
    }

    throw new Error(ERROR_MESSAGES.comment.DEFAULT);
  }
}

export async function deleteComment(
  threadId: number,
  commentId: number
): Promise<{ success: boolean }> {
  try {
    const response = await axiosInstance.delete(
      `/threads/${threadId}/comments/${commentId}`
    );

    return { success: response.status === 200 };
  } catch (error) {
    console.error('Error deleting comment:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        throw new Error(ERROR_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.comment.NOT_FOUND);
      }
    }

    throw new Error(ERROR_MESSAGES.comment.DEFAULT);
  }
}


export const fetchThreads = async (): Promise<ThreadResult> => {
  try {
    const response = await axiosInstance.get<ThreadResponse>('/threads');

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.thread.DEFAULT,
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
            message: errorData.message || ERROR_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      // Handle not found errors
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }

      // Handle server errors
      return {
        success: false,
        error: {
          message: ERROR_MESSAGES.thread.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.thread.DEFAULT,
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
        message: ERROR_MESSAGES.thread.DEFAULT,
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
            message: errorData.message || ERROR_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      // Handle not found errors
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }

      // Handle server errors
      return {
        success: false,
        error: {
          message: ERROR_MESSAGES.thread.SERVER_ERROR,
          code: 'SERVER_ERROR'
        }
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.thread.DEFAULT,
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
    const response = await axiosInstance.put<Thread>(`/threads/${threadId}`, threadData);

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.thread.DEFAULT,
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
            message: errorData.message || ERROR_MESSAGES.thread.VALIDATION_ERROR,
            code: errorData.code || 'VALIDATION_ERROR'
          }
        };
      }

      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }

      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export const fetchCategories = async (): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get<CategoryResponse>('/threads/categories');

    if (response.data) {
      return response.data;
    }

    return {
      data: []
    };
  } catch (error) {
    console.error('Categories fetching error:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
  }
};

export interface DeleteThreadResult {
  success: boolean;
  error?: {
    message: string;
    code: string;
  };
}

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
            message: ERROR_MESSAGES.auth.UNAUTHORIZED,
            code: 'UNAUTHORIZED'
          }
        };
      }

      // Handle not found errors
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: {
            message: ERROR_MESSAGES.thread.NOT_FOUND,
            code: 'NOT_FOUND'
          }
        };
      }

      // Handle forbidden errors (e.g., trying to delete someone else's thread)
      if (axiosError.response?.status === 403) {
        return {
          success: false,
          error: {
            message: 'لا يمكنك حذف هذه المناقشة',
            code: 'FORBIDDEN'
          }
        };
      }
    }

    return {
      success: false,
      error: {
        message: ERROR_MESSAGES.thread.DEFAULT,
        code: 'UNKNOWN_ERROR'
      }
    };
  }
};

export interface BookmarkResult {
  success: boolean;
  message: string;
  error?: string;
}

export const bookmarkThread = async (threadId: number): Promise<BookmarkResult> => {
  try {
    const response = await axiosInstance.post(`/threads/${threadId}/bookmark`);

    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message
      };
    }

    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
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
        throw new Error(ERROR_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
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

    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
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
        throw new Error(ERROR_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(ERROR_MESSAGES.thread.DEFAULT);
  }
};
