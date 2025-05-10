import { AxiosError, isAxiosError } from 'axios';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { ApiResult } from '@/types';

export function handleServiceError <T>(
  error: unknown,
  fallbackMessage: string
): ApiResult<T> {
  console.error('API Error:', error);

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; statusCode?: number }>;
    const status = axiosError.response?.status ?? axiosError.response?.data?.statusCode;
    const backendMessage = axiosError.response?.data?.message;

    let message = backendMessage || fallbackMessage;
    let code = 'UNKNOWN_ERROR';

    switch (status) {
      case 400:
        message = RESPONSE_MESSAGES.GLOBAL.VALIDATION_ERROR;
        code = 'VALIDATION_ERROR';
        break;
      case 401:
        message = RESPONSE_MESSAGES.GLOBAL.UNAUTHORIZED;
        code = 'UNAUTHORIZED';
        break;
      case 403:
        message = RESPONSE_MESSAGES.GLOBAL.FORBIDDEN;
        code = 'FORBIDDEN';
        break;
      case 404:
        message = RESPONSE_MESSAGES.GLOBAL.NOT_FOUND;
        code = 'NOT_FOUND';
        break;
      case 409:
        message = backendMessage || RESPONSE_MESSAGES.GLOBAL.CONFLICT;
        code = 'CONFLICT';
        break;
      case 500:
      default:
        code = 'SERVER_ERROR';
    }

    return {
      success: false,
      error: {
        message,
        code,
        status,
      },
    };
  }

  return {
    success: false,
    error: {
      message: fallbackMessage,
      code: 'UNKNOWN_ERROR',
    },
  };
};