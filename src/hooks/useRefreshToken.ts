'use client'

import axios from '@/api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post('/auth/refresh');
      setAuth(prev => ({
        ...prev,
        accessToken: response.data.accessToken
      }));
      return response.data.accessToken;
    } catch (error) {
      setAuth({
        accessToken: undefined,
        loading: false,
        user: undefined
      });
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;