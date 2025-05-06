import { AxiosError, isAxiosError } from "axios";
import { APIVoteResponse } from "@/types";
import axiosInstance from "@/api/axios";
import { VoteResponse } from "@/types";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";

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
      throw new Error(RESPONSE_MESSAGES.thread.VALIDATION_ERROR);
    }

    const { success, updatedVotes } = response.data;

    // Validate required fields
    if (typeof success !== 'boolean' || !updatedVotes) {
      throw new Error(RESPONSE_MESSAGES.thread.VALIDATION_ERROR);
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
        throw new Error(RESPONSE_MESSAGES.auth.UNAUTHORIZED);
      }
      
      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.thread.NOT_FOUND);
      }
      
      if (axiosError.response?.status === 400) {
        throw new Error(RESPONSE_MESSAGES.thread.VALIDATION_ERROR);
      }
    }
    
    throw new Error(RESPONSE_MESSAGES.thread.DEFAULT);
  }
}

export async function voteComment(
  threadId: number,
  commentId: number,
  voteType: "UP" | "DOWN"
): Promise<VoteResponse> {
  try {
    const response = await axiosInstance.post<APIVoteResponse>(`/threads/${threadId}/comments/${commentId}/vote`, {
      vote_type: voteType
    });

    // Validate response data structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error(RESPONSE_MESSAGES.comment.VALIDATION_ERROR);
    }

    const { success, updatedVotes } = response.data;

    // Validate required fields
    if (typeof success !== 'boolean' || !updatedVotes) {
      throw new Error(RESPONSE_MESSAGES.comment.VALIDATION_ERROR);
    }

    // Return transformed data
    return {
      success,
      votesCount: updatedVotes.score ?? 0,
      userVote: updatedVotes.user_vote ?? null
    };
  } catch (error) {
    console.error('Error voting on comment:', error);
    
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        throw new Error(RESPONSE_MESSAGES.auth.UNAUTHORIZED);
      }
      
      if (axiosError.response?.status === 404) {
        throw new Error(RESPONSE_MESSAGES.comment.NOT_FOUND);
      }
      
      if (axiosError.response?.status === 400) {
        throw new Error(RESPONSE_MESSAGES.comment.VALIDATION_ERROR);
      }
    }
    
    throw new Error(RESPONSE_MESSAGES.comment.DEFAULT);
  }
}