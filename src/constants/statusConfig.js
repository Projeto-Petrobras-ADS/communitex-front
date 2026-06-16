/**
 * Configurações de status para Issues (denúncias)
 */
export const ISSUE_STATUS = {
  ABERTA: { label: 'Aberta', color: 'warning', value: 'ABERTA' },
  EM_ANALISE: { label: 'Em Análise', color: 'info', value: 'EM_ANALISE' },
  EM_ANDAMENTO: { label: 'Em Andamento', color: 'secondary', value: 'EM_ANDAMENTO' },
  AGUARDANDO_CONFIRMACAO: { label: 'Aguardando confirmação', color: 'warning', value: 'AGUARDANDO_CONFIRMACAO' },
  RESOLVIDA: { label: 'Resolvida', color: 'success', value: 'RESOLVIDA' },
  CONTESTADA: { label: 'Contestada', color: 'error', value: 'CONTESTADA' },
  REJEITADA: { label: 'Rejeitada', color: 'error', value: 'REJEITADA' }
};

/**
 * Configurações de status para Praças
 */
export const PRACA_STATUS = {
  DISPONIVEL: { label: 'Disponível', color: 'success', value: 'DISPONIVEL' },
  EM_PROCESSO: { label: 'Em Processo', color: 'warning', value: 'EM_PROCESSO' },
  ADOTADA: { label: 'Adotada', color: 'error', value: 'ADOTADA' }
};

/**
 * Configurações de status para Propostas de Adoção
 */
export const PROPOSTA_STATUS = {
  PROPOSTA: { label: 'Proposta', color: 'info', value: 'PROPOSTA' },
  EM_ANALISE: { label: 'Em Análise', color: 'warning', value: 'EM_ANALISE' },
  APROVADA: { label: 'Aprovada', color: 'success', value: 'APROVADA' },
  REJEITADA: { label: 'Rejeitada', color: 'error', value: 'REJEITADA' },
  CONCLUIDA: { label: 'Concluída', color: 'success', value: 'CONCLUIDA' },
  FINALIZADA: { label: 'Finalizada', color: 'default', value: 'FINALIZADA' }
};

/**
 * Retorna a configuração de um status de issue
 */
export const getIssueStatusConfig = (status) => {
  return ISSUE_STATUS[status] || { label: status, color: 'default' };
};

/**
 * Retorna a configuração de um status de praça
 */
export const getPracaStatusConfig = (status) => {
  return PRACA_STATUS[status] || { label: status, color: 'default' };
};

/**
 * Retorna a configuração de um status de proposta
 */
export const getPropostaStatusConfig = (status) => {
  return PROPOSTA_STATUS[status] || { label: status, color: 'default' };
};
