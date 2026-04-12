// /src/services/api.js
import axios from 'axios';

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';

// Criamos uma instância do axios com a URL base do seu backend
const api = axios.create({
  baseURL: apiBaseUrl,
});

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

export default api;