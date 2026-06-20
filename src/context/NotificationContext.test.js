import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationProvider, useNotification } from './NotificationContext';

const NotificationActions = () => {
  const { notifyError, notifySuccess } = useNotification();
  return (
    <>
      <button onClick={() => notifySuccess('Operação concluída com sucesso.')}>Sucesso</button>
      <button onClick={() => notifyError('Não foi possível concluir a operação.')}>Erro</button>
    </>
  );
};

test('exibe notificações globais de sucesso e erro', async () => {
  render(
    <NotificationProvider>
      <NotificationActions />
    </NotificationProvider>
  );

  await userEvent.click(screen.getByRole('button', { name: 'Sucesso' }));
  expect(screen.getByText('Operação concluída com sucesso.')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Erro' }));
  expect(screen.getByText('Não foi possível concluir a operação.')).toBeInTheDocument();
});
