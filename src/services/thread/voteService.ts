import axiosInstance from '@/api/axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { handleServiceError } from '@/utils/api/service/handleServiceError';
import {
  ApiResult,
  ApiResponse,
  VoteResponse,
} from '@/types';

export const voteThread = async (
  threadId: number,
  voteType: 'UP' | 'DOWN'
): Promise<ApiResult<VoteResponse>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<VoteResponse>>(
      `/threads/${threadId}/vote`,
      {
        vote_type: voteType,
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleServiceError<VoteResponse>(
      error,
      RESPONSE_MESSAGES.thread.DEFAULT
    );
  }
};

export const voteComment = async (
  threadId: number,
  commentId: number,
  voteType: 'UP' | 'DOWN'
): Promise<ApiResult<VoteResponse>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<VoteResponse>>(
      `/threads/${threadId}/comments/${commentId}/vote`,
      {
        vote_type: voteType,
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      statusCode: response.data.statusCode,
    };
  } catch (error) {
    return handleServiceError<VoteResponse>(
      error,
      RESPONSE_MESSAGES.comment.DEFAULT
    );
  }
};
