import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import DashboardService from '../../services/DashboardService';
import EmpresaDashboard from './EmpresaDashboard';

jest.mock('react-router-dom', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
}), { virtual: true });

jest.mock('../../services/DashboardService', () => ({
  obterDashboardEmpresa: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  resolveApiUrl: (url) => url,
}));

test('exibe indicadores consolidados da empresa', async () => {
  DashboardService.obterDashboardEmpresa.mockResolvedValue({
    empresaNome: 'Empresa Verde',
    pracasDisponiveis: 8,
    totalPropostas: 4,
    propostasEmAnalise: 1,
    propostasAprovadas: 2,
    propostasRejeitadas: 1,
    pracasAdotadas: 2,
    denunciasRealizadas: 3,
    denunciasResolvidas: 1,
    totalApoiosRecebidos: 12,
    areaTotalAdotadaM2: 2500,
    taxaAprovacao: 50,
    adocoesProximasDoFim: 0,
    pracasRecomendadas: [],
    propostasRecentes: [],
    denunciasRecentes: [],
  });

  render(
    <ThemeProvider theme={theme}>
      <EmpresaDashboard />
    </ThemeProvider>
  );

  expect(await screen.findByText('Olá, Empresa Verde')).toBeInTheDocument();
  expect(screen.getByText('Praças disponíveis')).toBeInTheDocument();
  expect(screen.getByText('Denúncias realizadas')).toBeInTheDocument();
  expect(screen.getByText('2.500 m²')).toBeInTheDocument();
});
