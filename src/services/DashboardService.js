import api from './api';

const DashboardService = {
  obterDashboardEmpresa: async () => {
    const response = await api.get('/api/dashboard/empresa');
    return response.data;
  },

  obterDashboardUsuario: async () => {
    const response = await api.get('/api/dashboard/usuario');
    return response.data;
  },

  obterDashboardPublico: async () => {
    const response = await api.get('/api/dashboard/publico');
    return response.data;
  },
};

export default DashboardService;
