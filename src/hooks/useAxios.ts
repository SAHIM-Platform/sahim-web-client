'use client'

import { useEffect } from 'react';
import useAuth from './useAuth';
import axiosInstance from '@/api/axios';
import useRefreshToken from './useRefreshToken';

const useAxios = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const interceptors = {
      request: axiosInstance.interceptors.request.use(
        config => {
          if (!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
          }
          return config;
        },
        error => Promise.reject(error)
      ),
      response: axiosInstance.interceptors.response.use(
        response => response,
        async error => {
          const prevRequest = error?.config;
          if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(prevRequest);
          }
          return Promise.reject(error);
        }
      )
    };

    return () => {
      axiosInstance.interceptors.request.eject(interceptors.request);
      axiosInstance.interceptors.response.eject(interceptors.response);
    };
  }, [auth, refresh]);

  return axiosInstance;
};

export default useAxios;