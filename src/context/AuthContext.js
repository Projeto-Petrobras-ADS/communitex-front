import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const isExpired = decodedUser.exp && decodedUser.exp * 1000 <= Date.now();

        if (isExpired) {
          clearAuthTokens();
        } else {
          setUser(decodedUser);
        }
      } catch {
        clearAuthTokens();
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleForcedLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(jwtDecode(accessToken));
      return true;
    } catch {
      return false;
    }
  };

  const establishSession = ({ accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(jwtDecode(accessToken));
  };

  const logout = () => {
    setUser(null);
    clearAuthTokens();
  };

  const isAuthenticated = () => Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, establishSession, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
