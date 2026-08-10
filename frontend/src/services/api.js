import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = error.response?.data?.error || {
      message: error.message || 'An unexpected network error occurred',
      code: 'NETWORK_ERROR',
    };
    return Promise.reject(errorPayload);
  }
);

export const healthApi = {
  getHealth: () => api.get('/health'),
};

export default api;
