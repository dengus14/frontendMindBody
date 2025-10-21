import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // If 401, token is expired or invalid - user needs to login again
    if (error.response?.status === 403) {
      // Could redirect to login here or let components handle it
      console.log('Unauthorized - please login again');
    }
    return Promise.reject(error);
  }
);

export default api;
