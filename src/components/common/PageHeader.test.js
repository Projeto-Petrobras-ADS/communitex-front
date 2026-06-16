import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { Handshake as HandshakeIcon } from '@mui/icons-material';
import theme from '../../theme';
import PageHeader from './PageHeader';

jest.mock('react-router-dom', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}), { virtual: true });

const renderHeader = (icon) => render(
  <ThemeProvider theme={theme}>
    <PageHeader title="Manifestar interesse" subtitle="Proposta comunitária" icon={icon} />
  </ThemeProvider>
);

test('renderiza componente de ícone memoizado do Material UI', () => {
  renderHeader(HandshakeIcon);

  expect(screen.getByText('Manifestar interesse')).toBeInTheDocument();
  expect(screen.getByTestId('HandshakeIcon')).toBeInTheDocument();
});

test('renderiza ícone recebido como elemento JSX', () => {
  renderHeader(<HandshakeIcon data-testid="icone-instanciado" />);

  expect(screen.getByTestId('icone-instanciado')).toBeInTheDocument();
});
