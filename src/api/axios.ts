import getApiBaseUrl from '@/utils/api/getApiBaseUrl';
import axios from 'axios';


export const axiosPrivate = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true
});