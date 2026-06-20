import api from './api';

const AdocaoService = {
  registrarInteresse: async (pracaId, proposta) => {
    const response = await api.post('/api/adocao/interesse', {
      pracaId: Number(pracaId),
      proposta: proposta.trim(),
    });
    return response.data;
  },

  listarMinhasPropostas: async () => {
    const response = await api.get('/api/adocao/minhas-propostas');
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default AdocaoService;
