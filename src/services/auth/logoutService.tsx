import { AxiosInstance } from "axios";

export const logoutService = async (axiosInstance: AxiosInstance): Promise<void> => {
    try {
        await axiosInstance.post('/auth/signout');
    } catch (error) {
        console.error('Logout error:', error);
    }
};
