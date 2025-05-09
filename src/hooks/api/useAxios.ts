'use client'

import { useEffect } from 'react';
import { useAuth, useRefreshToken } from '@/hooks';
import axiosInstance from '@/api/axios';

export function useAxios() {
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
        response => {
          console.log('API Response:', response);
          return response;
        },
        async error => {
          const prevRequest = error?.config;
          
          // Prevent infinite refresh token loop
          if (error?.response?.status === 401 && !prevRequest?.sent && !prevRequest?.url?.includes('/auth/refresh')) {
            prevRequest.sent = true;
            try {
              const { accessToken } = await refresh();
              if (accessToken) {
                prevRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(prevRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
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