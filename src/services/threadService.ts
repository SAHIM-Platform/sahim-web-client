import axios from '@/api/axios';
import { ThreadResult, ThreadResponse } from '@/types/thread';
import { AxiosError, isAxiosError } from 'axios';
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';
import { ValidationErrorResponse } from '@/types';

export const fetchThreads = async (): Promise<ThreadResult> => {
    try {
        const response = await axios.get<ThreadResponse>('/threads');
        
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