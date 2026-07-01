/**
 * PracaService - Serviço centralizado para operações com Praças
 * Encapsula toda comunicação com os endpoints de praças e adoções
 */

import api from './api';

const PracaService = {
  /**
   * Busca todas as praças disponíveis
   * GET /api/pracas
   * @returns {Promise} Array de praças
   */
  listarPracas: async () => {
    try {
      const response = await api.get('/api/pracas');
      return response.data?.content || response.data;
    } catch (error) {
      console.error('Erro ao listar praças:', error);
      throw error;
    }
  },

  /**
   * Busca uma praça específica por ID
   * GET /api/pracas/{id}
   * @param {number} id - ID da praça
   * @returns {Promise} Dados da praça
   */
  buscarPracaSimples: async (id) => {
    try {
      const response = await api.get(`/api/pracas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar praça ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca uma praça com detalhes completos e histórico de interesses
   * GET /api/pracas/{id}/detalhes
   * @param {number} id - ID da praça
   * @returns {Promise} Dados da praça com cadastrante e histórico
   */
  buscarPracaComDetalhes: async (id) => {
    try {
      const response = await api.get(`/api/pracas/${id}/detalhes`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar detalhes da praça ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cadastra uma nova praça.
   * POST /api/pracas
   * @param {Object} pracaData - Dados da praça
   * @returns {Promise} Praça cadastrada
   */
  cadastrarPraca: async (pracaData, arquivo = null) => {
    try {
      const formData = new FormData();
      formData.append('dados', new Blob([JSON.stringify(pracaData)], { type: 'application/json' }));
      if (arquivo) formData.append('arquivo', arquivo);
      const response = await api.post('/api/pracas', formData);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar praça:', error);
      throw error;
    }
  },

  /**
   * Exclui uma praça.
   * DELETE /api/pracas/{id}
   * @param {number} id - ID da praça
   */
  excluirPraca: async (id) => {
    try {
      await api.delete(`/api/pracas/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir praça ID ${id}:`, error);
      throw error;
    }
  },

};

export default PracaService;
