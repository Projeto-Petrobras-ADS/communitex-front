// /src/services/IssueService.js
import api from './api';

const IssueService = {
  /**
   * Lista todas as denúncias
   */
  findAll: () => {
    return api.get('/api/issues').then((response) => ({
      ...response,
      data: response.data?.content || response.data,
    }));
  },

  /**
   * Busca denúncias por proximidade
   * @param {number} latitude - Latitude do ponto de referência
   * @param {number} longitude - Longitude do ponto de referência
   * @param {number} raioMetros - Raio de busca em metros (padrão: 1000)
   */
  findByProximity: (latitude, longitude, raioMetros = 1000) => {
    return api.get('/api/issues/proximidade', {
      params: { latitude, longitude, raioMetros }
    });
  },

  /**
   * Busca uma denúncia por ID
   * @param {number} id - ID da denúncia
   */
  findById: (id) => {
    return api.get(`/api/issues/${id}`);
  },

  /**
   * Busca detalhes completos de uma denúncia
   * @param {number} id - ID da denúncia
   */
  findByIdWithDetails: (id) => {
    return api.get(`/api/issues/${id}/detalhes`);
  },

  /**
   * Cria uma nova denúncia
   * @param {Object} issueData - Dados da denúncia
   * @param {string} issueData.titulo - Título (max 150 chars)
   * @param {string} issueData.descricao - Descrição (max 2000 chars)
   * @param {number} issueData.latitude - Latitude
   * @param {number} issueData.longitude - Longitude
   * @param {string} issueData.tipo - Tipo (ILUMINACAO, BURACO, LIXO, PODA_ARVORE, VAZAMENTO, PICHACAO, CALCADA_DANIFICADA, SINALIZACAO, OUTRO)
   */
  create: (issueData, arquivo = null) => {
    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(issueData)], { type: 'application/json' }));
    if (arquivo) formData.append('arquivo', arquivo);
    return api.post('/api/issues', formData);
  },

  /**
   * Atualiza o status de uma denúncia
   * @param {number} id - ID da denúncia
   * @param {string} status - Novo status (ABERTA, EM_ANALISE, EM_ANDAMENTO, RESOLVIDA, REJEITADA)
   */
  updateStatus: (id, status) => {
    return api.patch(`/api/issues/${id}/status`, { status });
  },

  findAtendimento: (id) => api.get(`/api/issues/${id}/atendimento`),
  assumirAtendimento: (id, descricaoPlanejada) => api.post(`/api/issues/${id}/atendimento`, { descricaoPlanejada }),
  iniciarAtendimento: (id) => api.patch(`/api/issues/${id}/atendimento/iniciar`),
  concluirAtendimento: (id, descricaoReparo, arquivo = null) => {
    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify({ descricaoReparo })], { type: 'application/json' }));
    if (arquivo) formData.append('arquivo', arquivo);
    return api.post(`/api/issues/${id}/atendimento/concluir`, formData);
  },
  confirmarAtendimento: (id) => api.post(`/api/issues/${id}/atendimento/confirmar`),
  contestarAtendimento: (id, motivo) => api.post(`/api/issues/${id}/atendimento/contestar`, { motivo }),
  listarReparosDisponiveis: () => api.get('/api/atendimentos/disponiveis'),
  listarMeusAtendimentos: () => api.get('/api/atendimentos/meus'),

  /**
   * Adiciona uma interação (comentário, apoio ou curtida) à denúncia
   * @param {number} issueId - ID da denúncia
   * @param {Object} interactionData - Dados da interação
   * @param {string} interactionData.tipo - Tipo (COMENTARIO, APOIO, CURTIDA)
   * @param {string} [interactionData.conteudo] - Conteúdo (obrigatório para comentário)
   */
  addInteraction: (issueId, interactionData) => {
    return api.post(`/api/issues/${issueId}/interacoes`, interactionData);
  },

  /**
   * Lista interações de uma denúncia
   * @param {number} issueId - ID da denúncia
   */
  findInteractions: (issueId) => {
    return api.get(`/api/issues/${issueId}/interacoes`);
  },

  /**
   * Remove uma interação de uma denúncia
   * @param {number} issueId - ID da denúncia
   * @param {number} interactionId - ID da interação
   */
  removeInteraction: (issueId, interactionId) => {
    return api.delete(`/api/issues/${issueId}/interacoes/${interactionId}`);
  }
};

export default IssueService;
