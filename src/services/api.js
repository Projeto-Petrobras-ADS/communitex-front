// /src/services/api.js
import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl) => {
  const fallbackUrl = 'http://localhost:8080';

  if (!rawUrl) {
    return fallbackUrl;
  }

  const sanitizedUrl = rawUrl.trim().replace(/\/$/, '');

  if (!sanitizedUrl) {
    return fallbackUrl;
  }

  const hasProtocol = /^https?:\/\//i.test(sanitizedUrl);
  return hasProtocol ? sanitizedUrl : `http://${sanitizedUrl}`;
};

const apiBaseUrl = normalizeApiBaseUrl(process.env.REACT_APP_API_BASE_URL);

export const resolveApiUrl = (url) => {
  if (!url || /^https?:\/\//i.test(url)) return url;
  return `${apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

// Criamos uma instância do axios com a URL base do seu backend
const api = axios.create({
  baseURL: apiBaseUrl,
});

export const normalizeApiError = (error) => {
  const data = error.response?.data;
  const message = data?.detail || data?.message || data?.title || error.message || 'Erro inesperado';

  return Object.assign(error, {
    status: error.response?.status,
    message,
    fieldErrors: data?.fieldErrors || [],
  });
};

/**
 * Interceptor para adicionar o token JWT em todas as requisições
 * quando ele estiver disponível.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const refreshToken = localStorage.getItem('refreshToken');

    if (status === 401 && refreshToken && !originalRequest._retry && !originalRequest.url?.includes('/api/auth/refresh')) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/api/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken || refreshToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(normalizeApiError(refreshError));
      }
    }

    if (status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.dispatchEvent(new Event('auth:logout'));
    }

    return Promise.reject(normalizeApiError(error));
  }
);

export default api;
