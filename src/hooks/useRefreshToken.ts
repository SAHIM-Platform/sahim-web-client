'use client'

import axios from '@/api/axios';
import useAuth from './useAuth';
import { AuthResponse, UserRole } from '@/types/auth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post<AuthResponse>('/auth/refresh');
      const { accessToken, user } = response.data;

      setAuth({
        accessToken,
        user: {
          ...user,
          approvalStatus: user.role === 'STUDENT' ? user.approvalStatus : undefined
        },
        loading: false,
      });

      console.log('Refresh token successful:', {
        accessToken: !!accessToken,
        user: {
          ...user,
          approvalStatus: user.role === 'STUDENT' ? user.approvalStatus : undefined
        }
      });

      return { accessToken, user };
    } catch (error) {
      setAuth({
        accessToken: undefined,
        user: undefined,
        loading: false,
      });
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;