import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000,
});

// Request Interceptor: Attach JWT Token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tenlea_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // Client safeguard: Never display raw database/infrastructure or token parsing errors
    if (
      typeof message === 'string' &&
      (message.includes('MongoDB') ||
        message.includes('Atlas') ||
        message.includes('0.0.0.0/0') ||
        message.includes('expiresIn'))
    ) {
      message = 'Authentication service is synchronizing. Please try again in a moment.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
