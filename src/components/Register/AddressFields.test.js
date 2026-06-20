import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddressFields from './AddressFields';
import ViaCepService from '../../services/ViaCepService';

jest.mock('../../services/ViaCepService', () => ({ buscarCep: jest.fn() }));

const Harness = () => {
  const [values, setValues] = React.useState({
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  });
  return (
    <AddressFields
      values={values}
      errors={{}}
      touched={{}}
      handleBlur={() => {}}
      setFieldValue={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
    />
  );
};

beforeEach(() => jest.clearAllMocks());

test('consulta o ViaCEP e preenche o endereço ao informar oito dígitos', async () => {
  ViaCepService.buscarCep.mockResolvedValue({
    logradouro: 'Rua das Flores',
    bairro: 'Centro',
    localidade: 'Florianópolis',
    uf: 'SC',
  });
  render(<Harness />);

  fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '88010000' } });

  await waitFor(() => expect(ViaCepService.buscarCep).toHaveBeenCalledWith('88010-000'));
  await waitFor(() => {
    expect(screen.getByLabelText('Logradouro')).toHaveValue('Rua das Flores');
    expect(screen.getByLabelText('Bairro')).toHaveValue('Centro');
    expect(screen.getByLabelText('Cidade')).toHaveValue('Florianópolis');
    expect(screen.getByLabelText('UF')).toHaveValue('SC');
  });
});

test('mantém o endereço editável quando a consulta falha', async () => {
  ViaCepService.buscarCep.mockRejectedValue(new Error('CEP não encontrado.'));
  render(<Harness />);

  fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '99999999' } });

  expect(await screen.findByText(/CEP não encontrado/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Logradouro'), { target: { value: 'Endereço manual' } });
  expect(screen.getByLabelText('Logradouro')).toHaveValue('Endereço manual');
});
