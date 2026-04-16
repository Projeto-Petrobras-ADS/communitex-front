// /src/services/api.js
import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl) => {
 // const fallbackUrl = 'http://localhost:8080';

 // if (!rawUrl) {
   // return fallbackUrl;
  //}

//  const sanitizedUrl = rawUrl.trim().replace(/\/$/, '');

 // if (!sanitizedUrl) {
   // return fallbackUrl;
  //}

  //const hasProtocol = /^https?:\/\//i.test(sanitizedUrl);
  //return hasProtocol ? sanitizedUrl : `http://${sanitizedUrl}`;
  return rawUrl
};

const apiBaseUrl = normalizeApiBaseUrl(process.env.REACT_APP_API_BASE_URL);

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

    const method = (config.method || 'get').toUpperCase();

    try {
      const fullUrl = new URL(config.url || '', config.baseURL || window.location.origin).toString();
      console.log(`[API] ${method} ${fullUrl}`);
    } catch {
      console.log(`[API] ${method} ${config.baseURL || ''}${config.url || ''}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;