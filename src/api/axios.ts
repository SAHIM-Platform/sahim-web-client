import getApiBaseUrl from '@/utils/api/getApiBaseUrl';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default axiosInstance;