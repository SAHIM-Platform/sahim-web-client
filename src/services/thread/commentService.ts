import axiosInstance from '@/api/axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { handleServiceError } from '@/utils/api/service/handleServiceError';
import {
  ApiResult,
  ApiResponse,
  ThreadComment,
  CreateCommentPayload,
} from '@/types';

export const createComment = async (
  threadId: number,
  payload: CreateCommentPayload
): Promise<ApiResult<ThreadComment>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<ThreadComment>>(
      `/threads/${threadId}/comments`,
      payload
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<ThreadComment>(
      error,
      RESPONSE_MESSAGES.comment.CREATE_FAILED
    );
  }
};

export const updateComment = async (
  threadId: number,
  commentId: number,
  payload: CreateCommentPayload
): Promise<ApiResult<ThreadComment>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<ThreadComment>>(
      `/threads/${threadId}/comments/${commentId}`,
      payload
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.status,
    };
  } catch (error) {
    return handleServiceError<ThreadComment>(
      error,
      RESPONSE_MESSAGES.comment.UPDATE_FAILED
    );
  }
};

export const deleteComment = async (
  threadId: number,
  commentId: number
): Promise<ApiResult<null>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/threads/${threadId}/comments/${commentId}`
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
      RESPONSE_MESSAGES.comment.DELETE_FAILED
    );
  }
};
