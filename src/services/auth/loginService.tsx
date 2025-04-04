import { axiosPrivate } from "@/api/axios";
import { AuthError, AuthResult, LoginCredentials } from "@/types/auth";
import { AxiosError, isAxiosError } from "axios";

async function loginService(credentials: LoginCredentials): Promise<AuthResult> {
	try {
		const response = await axiosPrivate.post('/auth/signin', credentials);
		console.log('response ', response)
		// there is accessToken? consider it success
		if (response.data && response.data.accessToken) {
			return {
				success: true,
				data: {
					message: response.data.message,
					accessToken: response.data.accessToken
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
						message: errorData.message || 'Invalid email or password',
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
						message: '',
						fields: ['email'],
						code: 'USER_NOT_FOUND'
					}
				};
			}

			// Handle validation errors
			if (axiosError.response?.status === 400) {
				const errorData = axiosError.response.data as any;

				return {
					success: false,
					error: {
						message: errorData.message || 'Invalid input data',
						fields: errorData.fields || [errorData.field].filter(Boolean),
						code: errorData.code || 'VALIDATION_ERROR'
					}
				};
			}

			// Handle server errors
			return {
				success: false,
				error: {
					message: 'Server error. Please try again later.',
					code: 'SERVER_ERROR'
				}
			};
		}

		// Handle unexpected errors
		return {
			success: false,
			error: {
				message: 'An unexpected error occurred. Please try again.',
				code: 'UNKNOWN_ERROR'
			}
		};
	}
};

export default loginService;