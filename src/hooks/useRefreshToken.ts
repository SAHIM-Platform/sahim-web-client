'use client'

import axios from '@/api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post('/auth/refresh');
      setAuth({
        accessToken: response.data.accessToken,
        user: response.data.user,
        loading: false,
      });
      return response.data.accessToken;
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