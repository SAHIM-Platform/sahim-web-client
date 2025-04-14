'use client'

import axios from '@/api/axios';
import useAuth from './useAuth';
import { AuthResponse } from '@/types/auth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post<AuthResponse>('/auth/refresh');
      const { accessToken, user } = response.data;

      setAuth({
        accessToken,
        user: {
          ...user
        },
        loading: false,
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