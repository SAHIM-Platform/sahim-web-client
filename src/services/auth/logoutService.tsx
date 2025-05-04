import axiosInstance from '@/api/axios';
import { isAxiosError } from "axios";
import { AuthResult, LogoutResponse, APIError } from "@/types";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";

export const logoutService = async (): Promise<AuthResult<LogoutResponse>> => {
    try {
        const response = await axiosInstance.post('/auth/signout');
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Logout error:', error);

        if (isAxiosError(error) && error.response?.data) {
            const apiError = error.response.data as APIError;
            return {
                success: false,
                error: {
                    message: apiError.message,
                    code: apiError.error
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
