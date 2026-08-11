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
  timeout: 60000, // 60s default timeout for API requests
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
    let message = 'An unexpected network error occurred';
    if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
      message = 'AI audio analysis timed out. The model server may be experiencing high demand or cold-starting. Please retry in a few moments.';
    } else if (error.response?.data?.error?.message) {
      message = error.response.data.error.message;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    const errorPayload = {
      message,
      code: error.response?.data?.error?.code || (error.code === 'ECONNABORTED' ? 'TIMEOUT_ERROR' : 'NETWORK_ERROR'),
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
      timeout: 90000, // 90s for audio upload
      onUploadProgress: onProgress,
    }),
  analyzeAudio: (data, onProgress) => {
    const isFormData = data instanceof FormData;
    return api.post('/radio/analyze', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
      timeout: 90000, // 90s for Hugging Face STT inference
      onUploadProgress: onProgress,
    });
  },
  getHistory: () => api.get('/radio/history'),
};

export const lapsApi = {
  uploadCsv: (formData, onProgress) =>
    api.post('/laps/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
      onUploadProgress: onProgress,
    }),
  analyzeLaps: (data) => api.post('/laps/analyze', data),
  getSession: () => api.get('/laps/session'),
};

export const healthApi = {
  getHealth: () => api.get('/health'),
};

export default api;
