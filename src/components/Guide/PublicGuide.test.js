import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import PublicGuide from './PublicGuide';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}), { virtual: true });

const renderGuide = () => render(
  <ThemeProvider theme={theme}>
    <PublicGuide />
  </ThemeProvider>
);

test('explica os fluxos de adocao, denuncia e aprovacao', () => {
  renderGuide();

  expect(screen.getByRole('heading', { name: /entenda como o cuidado vira ação/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /como funciona a adoção de praças/i })).toBeInTheDocument();
  expect(screen.getByText(/a administração aprova ou rejeita a proposta/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /como uma denúncia vira reparo/i })).toBeInTheDocument();
  expect(screen.getByText(/o autor da denúncia confirma o reparo/i)).toBeInTheDocument();
});

test('oferece caminhos publicos de cadastro e retorno', () => {
  renderGuide();

  expect(screen.getByRole('link', { name: 'Voltar' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: 'Cadastrar como morador' })).toHaveAttribute('href', '/register/pessoa-fisica');
  expect(screen.getByRole('link', { name: 'Cadastrar empresa' })).toHaveAttribute('href', '/register?tipo=empresa');
});
