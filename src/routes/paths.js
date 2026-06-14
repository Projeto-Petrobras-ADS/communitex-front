/**
 * Configuração de rotas da aplicação
 * @description Centraliza todas as rotas para fácil manutenção
 */

// Rotas Públicas
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_PESSOA_FISICA: '/register/pessoa-fisica',
};

// Rotas Protegidas (Autenticado)
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PRACAS: '/pracas',
  PRACA_DETAIL: '/pracas/:id',
  PRACA_MANIFESTAR: '/pracas/:id/manifestar-interesse',
  PRACA_PROPOR: '/pracas/:id/propor-adocao',
  MINHAS_PROPOSTAS: '/minhas-propostas',
  DENUNCIAS: '/denuncias',
  DENUNCIAS_LISTA: '/denuncias/lista',
  REPAROS: '/reparos',
};

// Rotas de Admin
export const ADMIN_ROUTES = {
  NOVA_PRACA: '/admin/pracas/nova',
  PROPOSTAS: '/admin/propostas',
};

// Rotas de User
export const USER_ROUTES = {
  NOVA_PRACA: '/user/pracas/nova',
};

/**
 * Helper para construir rotas dinâmicas
 */
export const buildRoute = {
  pracaDetail: (id) => `/pracas/${id}`,
  pracaManifestar: (id) => `/pracas/${id}/manifestar-interesse`,
  pracaPropor: (id) => `/pracas/${id}/propor-adocao`,
};
