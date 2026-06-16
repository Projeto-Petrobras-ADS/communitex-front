import api from './api';
import AdocaoService from './AdocaoService';

jest.mock('./api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

test('registra interesse usando o contrato atual da API', async () => {
  api.post.mockResolvedValue({ data: { id: 10 } });

  const result = await AdocaoService.registrarInteresse('5', '  Projeto comunitário completo  ');

  expect(api.post).toHaveBeenCalledWith('/api/adocao/interesse', {
    pracaId: 5,
    proposta: 'Projeto comunitário completo',
  });
  expect(result).toEqual({ id: 10 });
});

test('normaliza resposta inválida de minhas propostas como lista vazia', async () => {
  api.get.mockResolvedValue({ data: null });

  await expect(AdocaoService.listarMinhasPropostas()).resolves.toEqual([]);
});
