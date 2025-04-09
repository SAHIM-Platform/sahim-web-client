import axiosInstance from '@/api/axios';
import { AuthError, AuthResult, LoginCredentials } from "@/types/auth";
import { AxiosError, isAxiosError } from "axios";
import ERROR_MESSAGES from '@/utils/api/ERROR_MESSAGES';
import { ValidationErrorResponse } from '@/types';

async function loginService(credentials: LoginCredentials): Promise<AuthResult> {
	try {
		const response = await axiosInstance.post('/auth/signin', credentials);
		console.log('response ', response)
		// there is accessToken? consider it success
		if (response.data && response.data.accessToken) {
			return {
				success: true,
				data: {
					message: response.data.message,
					accessToken: response.data.accessToken,
					user: response.data.user
				}
			};
		} else {
			// no accessToken? consider it failure
			return {
				success: false,
				error: {
					message: 'Login failed.',
					code: 'AUTH_FAILED'
				}
			};
		}

	} catch (error) {
		if (isAxiosError(error)) {
			const axiosError = error as AxiosError;

			// Handle credentials errors
			if (axiosError.response?.status === 401) {
				const errorData = axiosError.response.data as AuthError;

				return {
					success: false,
					error: {
						message: errorData.message || ERROR_MESSAGES.login.INVALID_CREDENTIALS,
						fields: Array.isArray(errorData.fields) ? errorData.fields : ['email', 'password'],
						code: errorData.code || 'INVALID_CREDENTIALS'
					}
				};
			}

			// Handle user not found errors
			if (axiosError.response?.status === 404) {
				return {
					success: false,
					error: {
						message: ERROR_MESSAGES.login.USER_NOT_FOUND,
						fields: ['email'],
						code: 'USER_NOT_FOUND'
					}
				};
			}

			// Handle validation errors
			if (axiosError.response?.status === 400) {
				const errorData = axiosError.response.data as ValidationErrorResponse;

				return {
					success: false,
					error: {
						message: errorData.message || ERROR_MESSAGES.login.VALIDATION_ERROR,
						fields: errorData.fields || (errorData.field ? [errorData.field] : []),
						code: errorData.code || 'VALIDATION_ERROR'
					}
				};
			}

			// Handle server errors
			return {
				success: false,
				error: {
					message: ERROR_MESSAGES.login.SERVER_ERROR,
					code: 'SERVER_ERROR'
				}
			};
		}

		// Handle unexpected errors
		return {
			success: false,
			error: {
				message: ERROR_MESSAGES.login.DEFAULT,
				code: 'UNKNOWN_ERROR'
			}
		};
	}
};

export default loginService;