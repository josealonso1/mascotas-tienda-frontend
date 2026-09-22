import axios from 'axios';

const axiosClient = axios.create({
  // In development, Vite forwards /api requests to the configured backend.
  // This keeps the browser on one origin and avoids CORS failures locally.
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/login') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
