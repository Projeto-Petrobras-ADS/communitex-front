import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { Park as ParkIcon } from '@mui/icons-material';
import theme from '../../theme';
import EmptyState from './EmptyState';

test('renderiza ícone memoizado do Material UI', () => {
  render(
    <ThemeProvider theme={theme}>
      <EmptyState icon={ParkIcon} title="Nenhuma proposta" />
    </ThemeProvider>
  );

  expect(screen.getByText('Nenhuma proposta')).toBeInTheDocument();
  expect(screen.getByTestId('ParkIcon')).toBeInTheDocument();
});
