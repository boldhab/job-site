import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Attach JWT token if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Handle global API errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status === 401) {
      console.warn(`[axios] 401 Unauthorized received for: ${originalRequest.method?.toUpperCase()} ${originalRequest.url}. Logging out.`);

      // localStorage.removeItem('token');
      // localStorage.removeItem('user');

      // Don't redirect if we are already on the login page
      if (!window.location.pathname.includes('/login')) {
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (status === 403) {
      console.error('Access denied');
    }

    if (status >= 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default api;