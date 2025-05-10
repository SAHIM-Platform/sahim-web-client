import axiosInstance from '@/api/axios';
import { isAxiosError } from 'axios';
import { LogoutResponse, AuthError } from "@/types";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";

export const logoutService = async (): Promise<LogoutResponse> => {
	try {
		const response = await axiosInstance.post('/auth/signout');

		const logoutMessage = response.data?.data?.message || RESPONSE_MESSAGES.logout.SUCCESS;

		return {
			success: true,
			data: {
				message: logoutMessage
			}
		};
	} catch (error) {
		console.error('Logout error:', error);

		if (isAxiosError(error) && error.response?.data) {
			const apiError = error.response.data as AuthError;

			return {
				success: false,
				error: {
					message: apiError.message || RESPONSE_MESSAGES.logout.DEFAULT,
					code: apiError.code || 'UNKNOWN_ERROR'
				}
			};
		}

		return {
			success: false,
			error: {
				message: RESPONSE_MESSAGES.logout.DEFAULT,
				code: 'UNKNOWN_ERROR'
			}
		};
	}
};
