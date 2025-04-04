import getApiBaseUrl from '@/utils/api/getApiBaseUrl';
import axios from 'axios';

// Create a single axios instance for all API calls
const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Required for sending/receiving cookies
});

export default axiosInstance;