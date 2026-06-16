import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmpresaRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user?.roles?.includes('ROLE_EMPRESA')) {
    return <Navigate to="/pracas" replace state={{ accessMessage: 'Esta área é exclusiva para empresas cadastradas.' }} />;
  }

  return children;
};

export default EmpresaRoute;
