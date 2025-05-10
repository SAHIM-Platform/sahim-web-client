// Raw backend success response
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Raw backend error response
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;  // frontend-side user message
    code: string;     // e.g., 'NOT_FOUND', 'SERVER_ERROR', etc.
    status?: number;  // HTTP status code (from backend statusCode)
  };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;                     // unwrapped backend `.data`
  meta?: ApiResponse<T>['meta']; // optional pagination metadata
  message: string;             // backend `.message`
  statusCode: number;          // backend `.statusCode`
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;
