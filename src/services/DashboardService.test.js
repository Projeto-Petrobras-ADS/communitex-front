import api from './api';
import DashboardService from './DashboardService';

jest.mock('./api', () => ({
  get: jest.fn(),
}));

test('carrega o dashboard agregado da empresa', async () => {
  const dashboard = { empresaNome: 'Empresa Verde', pracasDisponiveis: 8 };
  api.get.mockResolvedValue({ data: dashboard });

  await expect(DashboardService.obterDashboardEmpresa()).resolves.toEqual(dashboard);
  expect(api.get).toHaveBeenCalledWith('/api/dashboard/empresa');
});

test('carrega o dashboard agregado do cidadão', async () => {
  const dashboard = { usuarioNome: 'Maria', denunciasRealizadas: 4 };
  api.get.mockResolvedValue({ data: dashboard });

  await expect(DashboardService.obterDashboardUsuario()).resolves.toEqual(dashboard);
  expect(api.get).toHaveBeenCalledWith('/api/dashboard/usuario');
});

test('carrega o dashboard publico agregado', async () => {
  const dashboard = { totalPracas: 10, pracasAdotadas: 4 };
  api.get.mockResolvedValue({ data: dashboard });

  await expect(DashboardService.obterDashboardPublico()).resolves.toEqual(dashboard);
  expect(api.get).toHaveBeenCalledWith('/api/dashboard/publico');
});
