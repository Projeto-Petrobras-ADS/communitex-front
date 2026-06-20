import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Register from './Register';
import api from '../../services/api';

const mockEstablishSession = jest.fn();
const mockNavigate = jest.fn();
let mockAccountType = null;

jest.mock('../../services/api', () => ({ post: jest.fn() }));
jest.mock('../../context/AuthContext', () => ({ useAuth: () => ({ establishSession: mockEstablishSession }) }));
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => mockNavigate,
  useSearchParams: () => [{ get: () => mockAccountType }],
}), { virtual: true });

const renderRegister = () => render(<Register />);

beforeEach(() => {
  jest.clearAllMocks();
  mockAccountType = null;
});

test('starts as morador and switches to company-specific fields', () => {
  renderRegister();
  expect(screen.getByLabelText('Nome completo')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /empresa/i }));

  expect(screen.queryByLabelText('Nome completo')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Razão social')).toBeInTheDocument();
  expect(screen.getByLabelText('CNPJ')).toBeInTheDocument();
});

test('uses company query parameter as the initial profile', () => {
  mockAccountType = 'empresa';
  renderRegister();
  expect(screen.getByLabelText('Razão social')).toBeInTheDocument();
});

test('registers, establishes the returned session and opens the dashboard', async () => {
  api.post.mockResolvedValue({ data: { accessToken: 'access', refreshToken: 'refresh' } });
  renderRegister();

  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Maria Silva' } });
  fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '52998224725' } });
  fireEvent.change(screen.getByLabelText('E-mail de acesso'), { target: { value: 'maria@email.com' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'Senha@123' } });
  fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'Senha@123' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Criar conta e entrar' }));

  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
    tipoConta: 'PESSOA_FISICA', cpf: '52998224725', email: 'maria@email.com',
  })));
  expect(mockEstablishSession).toHaveBeenCalledWith({ accessToken: 'access', refreshToken: 'refresh' });
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true, state: { registrationSuccess: true } });
});

test('shows structured server errors next to their fields', async () => {
  api.post.mockRejectedValue({ response: { data: { errors: { cpf: 'Este CPF já possui cadastro' } } } });
  renderRegister();

  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Maria Silva' } });
  fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '52998224725' } });
  fireEvent.change(screen.getByLabelText('E-mail de acesso'), { target: { value: 'maria@email.com' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'Senha@123' } });
  fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'Senha@123' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Criar conta e entrar' }));

  expect(await screen.findByText('Este CPF já possui cadastro')).toBeInTheDocument();
});
