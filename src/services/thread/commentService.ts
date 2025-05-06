import { isAxiosError, AxiosError } from "axios";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { CommentResponse } from "@/types";
import axiosInstance from "@/api/axios";

export async function createComment(threadId: number, content: string): Promise<CommentResponse> {
  try {
    const response = await axiosInstance.post<CommentResponse>(`/threads/${threadId}/comments`, {
      content
    });

    if (response.data) {
      return response.data;
    }

    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  } catch (error) {
    console.error('Error creating comment:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 400) {
        throw new Error(RESPONSE_MESSAGES.thread.VALIDATION_ERROR);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.thread.NOT_FOUND);
      }
    }

    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  }
}

export async function updateComment(
  threadId: number,
  commentId: number,
  content: string
): Promise<CommentResponse> {
  try {
    const response = await axiosInstance.patch<CommentResponse>(
      `/threads/${threadId}/comments/${commentId}`,
      { content }
    );

    if (response.data) {
      return response.data;
    }

    throw new Error(RESPONSE_MESSAGES.comment.DEFAULT);
  } catch (error) {
    console.error('Error updating comment:', error);

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 400) {
        throw new Error(RESPONSE_MESSAGES.comment.VALIDATION_ERROR);
      }

      if (axiosError.response?.status === 401) {
        throw new Error(RESPONSE_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.comment.NOT_FOUND);
      }
    }

    throw new Error(RESPONSE_MESSAGES.comment.DEFAULT);
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
        throw new Error(RESPONSE_MESSAGES.auth.UNAUTHORIZED);
      }

      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.comment.NOT_FOUND);
      }
    }

    throw new Error(RESPONSE_MESSAGES.comment.DEFAULT);
  }
}