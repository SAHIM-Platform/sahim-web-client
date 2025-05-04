import axiosInstance from '@/api/axios';
import { AuthError, AuthResult, LoginCredentials } from "@/types";
import { AxiosError, isAxiosError } from "axios";
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import { ValidationErrorResponse } from '@/types';

async function loginService(credentials: LoginCredentials): Promise<AuthResult> {
	try {
		const requestBody = {
			identifier: credentials.identifier,
			password: credentials.password
		};
		console.log('Login request body:', requestBody);
		
		const response = await axiosInstance.post('/auth/signin', requestBody);
		console.log('Login response:', response.data);

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
					message: 'فشل تسجيل الدخول',
					code: 'AUTH_FAILED'
				}
			};
		}

	} catch (error) {
		console.error('Login error details:', error);
		
		if (isAxiosError(error)) {
			const axiosError = error as AxiosError;
			console.error('Axios error response:', {
				status: axiosError.response?.status,
				data: axiosError.response?.data,
				message: axiosError.message
			});

			// Handle credentials errors
			if (axiosError.response?.status === 401) {
				const errorData = axiosError.response.data as AuthError;

				return {
					success: false,
					error: {
						message: errorData.message || RESPONSE_MESSAGES.login.INVALID_CREDENTIALS,
						fields: Array.isArray(errorData.fields) ? errorData.fields : ['identifier', 'password'],
						code: errorData.code || 'INVALID_CREDENTIALS'
					}
				};
			}

			// Handle user not found errors
			if (axiosError.response?.status === 404) {
				return {
					success: false,
					error: {
						message: RESPONSE_MESSAGES.login.USER_NOT_FOUND,
						fields: ['identifier'],
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
						message: errorData.message || RESPONSE_MESSAGES.login.VALIDATION_ERROR,
						fields: errorData.fields || (errorData.field ? [errorData.field] : []),
						code: errorData.code || 'VALIDATION_ERROR'
					}
				};
			}

			// Handle server errors
			return {
				success: false,
				error: {
					message: RESPONSE_MESSAGES.login.SERVER_ERROR,
					code: 'SERVER_ERROR'
				}
			};
		}

		// Handle unexpected errors
		return {
			success: false,
			error: {
				message: RESPONSE_MESSAGES.login.DEFAULT,
				code: 'UNKNOWN_ERROR'
			}
		};
	}
};

export default loginService;