'use client'

import { useEffect } from 'react';
import useAuth from './useAuth';
import axiosInstance from '@/api/axios';

const useAxios = () => {
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      response => response,
      error => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [auth]);

  return axiosInstance;
};

export default useAxios;