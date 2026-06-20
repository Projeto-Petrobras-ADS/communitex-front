import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import DashboardService from '../../services/DashboardService';
import ImpactDashboard from './ImpactDashboard';

jest.mock('../../services/DashboardService', () => ({
  obterDashboardPublico: jest.fn(),
}));

const dashboard = {
  totalPracas: 10,
  pracasAdotadas: 4,
  areaAdotadaM2: 7200,
  reparosConfirmados: 8,
  tempoMedioReparoHoras: 18.5,
  taxaAdocao: 40,
  taxaConfirmacaoReparos: 80,
  evolucaoMensal: [
    { mes: '2026-05', adocoesAcumuladas: 2, reparosConfirmadosAcumulados: 5 },
    { mes: '2026-06', adocoesAcumuladas: 4, reparosConfirmadosAcumulados: 8 },
  ],
};

const renderDashboard = () => render(
  <ThemeProvider theme={theme}>
    <ImpactDashboard />
  </ThemeProvider>
);

test('exibe indicadores reais e grafico de impacto', async () => {
  DashboardService.obterDashboardPublico.mockResolvedValue(dashboard);

  renderDashboard();

  expect(await screen.findByText('Praças adotadas')).toBeInTheDocument();
  expect(screen.getByText('7.200 m²')).toBeInTheDocument();
  expect(screen.getByText('18,5 h')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /evolução mensal acumulada/i })).toBeInTheDocument();
  expect(screen.getByText('80,0%')).toBeInTheDocument();
});

test('mantem a landing utilizavel quando os indicadores falham', async () => {
  DashboardService.obterDashboardPublico.mockRejectedValue(new Error('offline'));

  renderDashboard();

  expect(await screen.findByText(/indicadores de impacto estão temporariamente indisponíveis/i)).toBeInTheDocument();
  expect(screen.queryByText('Praças adotadas')).not.toBeInTheDocument();
});
