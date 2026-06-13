import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmpresaDashboard from './EmpresaDashboard';
import UsuarioDashboard from './UsuarioDashboard';

const RoleDashboard = () => {
  const { user } = useAuth();
  const roles = user?.roles || [];

  if (roles.includes('ROLE_EMPRESA')) return <EmpresaDashboard />;
  if (roles.includes('ROLE_USER')) return <UsuarioDashboard />;
  return <Navigate to="/pracas" replace />;
};

export default RoleDashboard;
