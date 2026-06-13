import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import DashboardService from '../../services/DashboardService';
import UsuarioDashboard from './UsuarioDashboard';

jest.mock('react-router-dom', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
}), { virtual: true });

jest.mock('../../services/DashboardService', () => ({
  obterDashboardUsuario: jest.fn(),
}));

test('exibe indicadores comunitários do cidadão', async () => {
  DashboardService.obterDashboardUsuario.mockResolvedValue({
    usuarioNome: 'Maria Silva',
    pracasCadastradas: 3,
    pracasDisponiveis: 1,
    pracasEmProcesso: 1,
    pracasAdotadas: 1,
    denunciasRealizadas: 4,
    denunciasAbertas: 1,
    denunciasEmAndamento: 2,
    denunciasResolvidas: 1,
    totalApoiosRecebidos: 8,
    apoiosRealizados: 5,
    comentariosRealizados: 2,
    taxaResolucao: 25,
    pracasRecentes: [],
    denunciasRecentes: [],
  });

  render(
    <ThemeProvider theme={theme}>
      <UsuarioDashboard />
    </ThemeProvider>
  );

  expect(await screen.findByText('Olá, Maria Silva')).toBeInTheDocument();
  expect(screen.getByText('Praças cadastradas')).toBeInTheDocument();
  expect(screen.getByText('Apoios realizados')).toBeInTheDocument();
  expect(screen.getByText('25%')).toBeInTheDocument();
});
