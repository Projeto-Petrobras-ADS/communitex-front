import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import ProfileService from '../../services/ProfileService';

const mockNotifySuccess = jest.fn();
const mockNotifyError = jest.fn();
const mockEstablishSession = jest.fn();

jest.mock('../../services/ProfileService', () => ({
  get: jest.fn(),
  update: jest.fn(),
  changePassword: jest.fn(),
}));
jest.mock('../../context/NotificationContext', () => ({
  useNotification: () => ({ notifySuccess: mockNotifySuccess, notifyError: mockNotifyError }),
}));
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ establishSession: mockEstablishSession }),
}));
jest.mock('../Register/AddressFields', () => ({ values, setFieldValue }) => (
  <input aria-label="CEP" value={values.cep || ''} onChange={(event) => setFieldValue('cep', event.target.value)} />
));

const profile = {
  tipoConta: 'PESSOA_FISICA',
  nome: 'Maria Silva',
  documento: '52998224725',
  emailAcesso: 'maria@email.com',
  telefone: '48999990000',
  cep: '88010000',
  logradouro: 'Rua das Flores',
  numero: '10',
  complemento: '',
  bairro: 'Centro',
  cidade: 'Florianópolis',
  estado: 'SC',
  completo: true,
};

beforeEach(() => {
  jest.clearAllMocks();
  ProfileService.get.mockResolvedValue(profile);
});

test('carrega e atualiza os dados editáveis do perfil', async () => {
  ProfileService.update.mockResolvedValue({ ...profile, telefone: '48988887777' });
  render(<ProfilePage />);

  expect(await screen.findByDisplayValue('Maria Silva')).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Telefone com DDD'), { target: { value: '48988887777' } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

  await waitFor(() => expect(ProfileService.update).toHaveBeenCalledWith(expect.objectContaining({
    telefone: '(48) 98888-7777',
  })));
  expect(mockNotifySuccess).toHaveBeenCalledWith('Perfil atualizado com sucesso.');
});

test('altera a senha e estabelece a sessão renovada', async () => {
  const session = { accessToken: 'novo-access', refreshToken: 'novo-refresh' };
  ProfileService.changePassword.mockResolvedValue(session);
  render(<ProfilePage />);
  await screen.findByDisplayValue('Maria Silva');

  fireEvent.change(screen.getByLabelText('Senha atual'), { target: { value: 'Antiga@123' } });
  fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: 'Nova@1234' } });
  fireEvent.change(screen.getByLabelText('Confirmar nova senha'), { target: { value: 'Nova@1234' } });
  fireEvent.click(screen.getByRole('button', { name: 'Alterar senha' }));

  await waitFor(() => expect(ProfileService.changePassword).toHaveBeenCalledWith({
    senhaAtual: 'Antiga@123', novaSenha: 'Nova@1234', confirmacaoSenha: 'Nova@1234',
  }));
  expect(mockEstablishSession).toHaveBeenCalledWith(session);
  expect(mockNotifySuccess).toHaveBeenCalledWith('Senha alterada com sucesso.');
});

test('exibe erro associado à senha atual', async () => {
  ProfileService.changePassword.mockRejectedValue({
    response: { data: { errors: { senhaAtual: 'A senha atual está incorreta' } } },
  });
  render(<ProfilePage />);
  await screen.findByDisplayValue('Maria Silva');

  fireEvent.change(screen.getByLabelText('Senha atual'), { target: { value: 'Errada@123' } });
  fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: 'Nova@1234' } });
  fireEvent.change(screen.getByLabelText('Confirmar nova senha'), { target: { value: 'Nova@1234' } });
  fireEvent.click(screen.getByRole('button', { name: 'Alterar senha' }));

  expect(await screen.findByText('A senha atual está incorreta')).toBeInTheDocument();
});
