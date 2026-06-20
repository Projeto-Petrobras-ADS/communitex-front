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

jest.mock('../Profile/ProfileCompletionPrompt', () => () => null);

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
    areaTotalAdotadaM2: 2500,
    taxaAprovacao: 50,
    adocoesProximasDoFim: 0,
    totalReparos: 5,
    reparosAtivos: 3,
    reparosAceitos: 1,
    reparosEmAndamento: 1,
    reparosAguardandoConfirmacao: 1,
    reparosConfirmados: 1,
    reparosContestados: 1,
    pracasRecomendadas: [],
    propostasRecentes: [],
    reparosRecentes: [],
  });

  render(
    <ThemeProvider theme={theme}>
      <EmpresaDashboard />
    </ThemeProvider>
  );

  expect(await screen.findByText('Olá, Empresa Verde')).toBeInTheDocument();
  expect(screen.getByText('Praças disponíveis')).toBeInTheDocument();
  expect(screen.getByText('Reparos ativos')).toBeInTheDocument();
  expect(screen.queryByText('Denúncias realizadas')).not.toBeInTheDocument();
  expect(screen.getByText('Reparos recentes')).toBeInTheDocument();
  expect(screen.getByText('2.500 m²')).toBeInTheDocument();
});
