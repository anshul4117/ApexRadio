import axios from 'axios';

// Normalize VITE_API_URL to ensure /api suffix is present when pointing to full backend host
const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL || '/api';
  envUrl = envUrl.trim();

  // If pointing to absolute URL (e.g. https://apexradio.onrender.com), ensure /api is attached
  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    if (!cleanUrl.endsWith('/api')) {
      return `${cleanUrl}/api`;
    }
    return cleanUrl;
  }

  // Local development proxy fallback
  return envUrl.replace(/\/+$/, '') || '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('apexradio_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore storage access errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response payload or error
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = error.response?.data?.error || {
      message: error.response?.data?.message || error.message || 'An unexpected network error occurred',
      code: error.response?.data?.error?.code || 'NETWORK_ERROR',
    };
    return Promise.reject(errorPayload);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const radioApi = {
  uploadAudio: (formData, onProgress) =>
    api.post('/radio/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  analyzeAudio: (data, onProgress) => {
    const isFormData = data instanceof FormData;
    return api.post('/radio/analyze', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
      onUploadProgress: onProgress,
    });
  },
  getHistory: () => api.get('/radio/history'),
};

export const lapsApi = {
  uploadCsv: (formData, onProgress) =>
    api.post('/laps/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  analyzeLaps: (data) => api.post('/laps/analyze', data),
  getSession: () => api.get('/laps/session'),
};

export const healthApi = {
  getHealth: () => api.get('/health'),
};

export default api;
