# Requisitos do Projeto Communitex

## Visão Geral
Communitex é uma plataforma digital que conecta empresas, cidadãos e o poder público para facilitar a adoção e manutenção de praças e espaços públicos, promovendo cidades mais sustentáveis e alinhadas com a ODS 11.

---

## Requisitos Funcionais

### RF 1 - Autenticação e Autorização
- **RF 1.1** O sistema deve permitir login de usuários com email e senha
- **RF 1.2** O sistema deve validar credenciais contra o backend
- **RF 1.3** O sistema deve suportar três papéis de usuário: ADMIN, EMPRESA (ROLE_EMPRESA), PESSOA_FÍSICA (ROLE_USER)
- **RF 1.4** O sistema deve redirecionar usuários para rotas específicas baseado em seu papel
- **RF 1.5** O sistema deve manter o token JWT armazenado localmente para persistência de sessão
- **RF 1.6** O sistema deve permitir logout e limpeza de autenticação

### RF 2 - Cadastro de Usuários
#### RF 2.1 - Cadastro de Empresa
- **RF 2.1.1** O sistema deve permitir registro de empresas com os seguintes dados:
  - Razão Social (obrigatório)
  - CNPJ validado (obrigatório, formato: XX.XXX.XXX/XXXX-XX)
  - Email (obrigatório, será login)
  - Telefone (obrigatório, 10-11 dígitos)
  - Endereço (obrigatório, mínimo 5 caracteres)
  - Cidade/Bairro (obrigatório)
  - Nome do Representante Legal (obrigatório)
  - Email do Representante (obrigatório)
  - Senha (obrigatório, mínimo 8 caracteres, com maiúsculas, minúsculas, números e caracteres especiais)
- **RF 2.1.2** O sistema deve validar unicidade do CNPJ e Email
- **RF 2.1.3** O sistema deve exibir mensagens de erro de validação em tempo real

#### RF 2.2 - Cadastro de Pessoa Física
- **RF 2.2.1** O sistema deve permitir registro de pessoas físicas com os seguintes dados:
  - Nome Completo (obrigatório, mínimo 3 caracteres)
  - CPF validado (obrigatório, formato: 11 dígitos)
  - Email (obrigatório)
  - Telefone (obrigatório, 10-11 dígitos)
  - Endereço (obrigatório, mínimo 5 caracteres)
  - Bairro/Cidade (obrigatório)
  - Estado (obrigatório, 2 caracteres)
  - CEP (obrigatório, 8 dígitos)
  - Senha (obrigatório, mínimo 8 caracteres, com maiúsculas, minúsculas, números e caracteres especiais)
  - Aceitar Termos de Uso (obrigatório)
- **RF 2.2.2** O sistema deve validar unicidade de CPF e Email
- **RF 2.2.3** O sistema deve permitir visualização/ocultação de senha durante registro
- **RF 2.2.4** O sistema deve exibir notificação de sucesso após registro

### RF 3 - Gerenciamento de Praças
#### RF 3.1 - Listagem de Praças
- **RF 3.1.1** O sistema deve exibir lista de todas as praças com filtros por status (DISPONIVEL, EM_PROCESSO, ADOTADA)
- **RF 3.1.2** O sistema deve exibir cards com as seguintes informações por praça:
  - Nome
  - Localização com cidade
  - Tamanho/Metragem (se disponível)
  - Status com badge com cores específicas:
    - Verde para DISPONIVEL
    - Laranja para EM_PROCESSO
    - Vermelho para ADOTADA
- **RF 3.1.3** O sistema deve permitir visualização de detalhes clicando no card
- **RF 3.1.4** O sistema deve exibir botão "Manifestar Interesse" apenas para empresas autenticadas
- **RF 3.1.5** O sistema deve exibir mensagem de estado vazio quando não há praças
- **RF 3.1.6** O sistema deve exibir estado de carregamento enquanto busca dados

#### RF 3.2 - Cadastro de Praças (ADMIN/ROLE_USER)
- **RF 3.2.1** O sistema deve permitir que ADMIN e ROLE_USER cadastrem novas praças com:
  - Nome da Praça (obrigatório, mínimo 5 caracteres)
  - Logradouro (opcional)
  - Bairro (opcional)
  - Cidade (obrigatório)
  - Localização por ponto ou polígono desenhado no mapa
  - Latitude e longitude calculadas pelo polígono ou pelo ponto marcado
  - Metragem em m² calculada pelo polígono ou informada no modo ponto
  - Status (obrigatório: DISPONIVEL, EM_PROCESSO, ADOTADA)
  - Descrição (opcional, máximo 1000 caracteres)
  - URL da Foto (opcional, deve ser URL válida)
- **RF 3.2.2** O sistema deve validar todos os campos conforme especificado
- **RF 3.2.3** O sistema deve exibir notificação de sucesso e redirecionar para listagem
- **RF 3.2.4** O sistema deve exibir erros do servidor de forma clara

#### RF 3.3 - Detalhes da Praça
- **RF 3.3.1** O sistema deve exibir página detalhada da praça com:
  - Foto (se disponível)
  - Nome
  - Badge de status
  - Informações: Praça, Localização, Bairro, Cidade, Mapa, Metragem
  - Descrição completa
  - Informações do cadastrante
  - Histórico de interesses
- **RF 3.3.2** O sistema deve permitir ação "Manifestar Interesse" para empresas autenticadas se status = DISPONIVEL
- **RF 3.3.3** O sistema deve exibir "Processo em Andamento" se status = EM_PROCESSO
- **RF 3.3.4** O sistema deve exibir "Praça Adotada" com link para listagem se status = ADOTADA
- **RF 3.3.5** O sistema deve exibir "Acesso Restrito" para usuários não autenticados

### RF 4 - Manifestação de Interesse
- **RF 4.1** O sistema deve permitir que empresas manifestem interesse em adotar uma praça
- **RF 4.2** A manifestação deve conter:
  - Descrição do projeto (obrigatório, 20-2000 caracteres)
  - Informações sobre manutenção planejada
  - Cronograma estimado
  - Estrutura de equipe responsável
- **RF 4.3** O sistema deve exibir dicas e orientações na barra lateral
- **RF 4.4** O sistema deve validar extensão de caracteres em tempo real
- **RF 4.5** O sistema deve permitir cancelamento da manifestação
- **RF 4.6** O sistema deve exibir notificação de sucesso e redirecionar para detalhes da praça

### RF 5 - Propostas de Adoção
#### RF 5.1 - Envio de Proposta
- **RF 5.1.1** O sistema deve permitir criação de proposta formal de adoção com:
  - Descrição do projeto (20-1000 caracteres, obrigatório)
  - Data de início (obrigatório)
  - Data de término (opcional, não pode ser anterior a início)
  - Cronograma (texto descritivo)
  - Recursos financeiros
  - Impacto ambiental
- **RF 5.1.2** O sistema deve validar todas as datas
- **RF 5.1.3** O sistema deve permitir salvar rascunho ou enviar proposta

#### RF 5.2 - Acompanhamento de Propostas (Empresa)
- **RF 5.2.1** O sistema deve exibir lista de todas as propostas enviadas pela empresa
- **RF 5.2.2** Cada proposta deve mostrar:
  - Nome da praça
  - Data de envio
  - Descrição resumida (com truncagem se > 100 caracteres)
  - Status com badge:
    - Proposta
    - Em Análise
    - Aprovada
    - Rejeitada
    - Concluída
    - Finalizada
  - Link para visualizar detalhes da praça
- **RF 5.2.3** O sistema deve ordenar propostas por data (mais recentes primeiro)

### RF 6 - Gerenciamento de Propostas (ADMIN)
- **RF 6.1** O sistema deve permitir que ADMIN visualize todas as propostas do sistema
- **RF 6.2** O sistema deve exibir para cada proposta:
  - ID da proposta
  - Empresa responsável
  - Praça alvo
  - Data de envio
  - Status atual
  - Ações (Aprovar, Rejeitar, Ver Detalhes)
- **RF 6.3** O sistema deve permitir ADMIN aprovar ou rejeitar propostas
- **RF 6.4** O sistema deve permitir adicionar comentários/motivo de rejeição
- **RF 6.5** O sistema deve manter auditoria de mudanças de status

### RF 7 - Histórico de Interesses
- **RF 7.1** O sistema deve manter histórico de todas as manifestações de interesse
- **RF 7.2** Cada registro deve conter:
  - Empresa interessada
  - Data da manifestação
  - Descrição da proposta
  - Status atual
- **RF 7.3** O sistema deve permitir visualização do histórico na página de detalhes da praça

### RF 8 - Landing Page
- **RF 8.1** O sistema deve exibir página de boas-vindas com:
  - Hero section com call-to-action
  - Seção "Como Funciona" (5 passos)
  - Seção de Responsabilidades (empresa, prefeitura, comunidade)
  - Seção de Benefícios
  - Links de cadastro/login
- **RF 8.2** O sistema deve exibir dropdown de registro (Empresa/Pessoa Física)
- **RF 8.3** O sistema deve ser responsiva e acessível

### RF 9 - Navegação e Layouts
- **RF 9.1** O sistema deve exibir header com:
  - Logo Communitex
  - Informação de boas-vindas com nome do usuário
  - Links de navegação baseados em papel:
    - ADMIN: Ver Praças, Gerenciar Praças, Gerenciar Propostas
    - EMPRESA: Ver Praças, Minhas Propostas
    - PESSOA_FÍSICA: Ver Praças
  - Botão de logout com tema verde
- **RF 9.2** O header deve ter gradient verde sustentável
- **RF 9.3** O sistema deve redirecionar /dashboard para /pracas

---

## Requisitos Não-Funcionais

### RNF 1 - Performance
- **RNF 1.1** O tempo de carregamento da aplicação deve ser ≤ 3 segundos
- **RNF 1.2** Operações de busca devem retornar em ≤ 1 segundo
- **RNF 1.3** A aplicação deve suportar ≥ 1000 usuários simultâneos
- **RNF 1.4** Imagens devem ser otimizadas e comprimidas
- **RNF 1.5** CSS Modules devem estar scoped para evitar conflitos

### RNF 2 - Responsividade
- **RNF 2.1** A aplicação deve ser totalmente responsiva em:
  - Desktop (≥ 1024px)
  - Tablet (768px - 1023px)
  - Mobile (≤ 767px)
  - Extra pequeno (≤ 480px)
- **RNF 2.2** Layout deve se adaptar graciosamente sem quebras
- **RNF 2.3** Imagens deve se redimensionar proporcionalamente
- **RNF 2.4** Toques em mobile devem ter área mínima de 44x44px

### RNF 3 - Usabilidade
- **RNF 3.1** Validações de formulário devem acontecer em tempo real (Formik + Yup)
- **RNF 3.2** Mensagens de erro devem ser claras e acionáveis
- **RNF 3.3** Estados de carregamento devem ser indicados com spinners
- **RNF 3.4** Confirmações de sucesso devem ser exibidas com toasts
- **RNF 3.5** Navegação de volta deve estar sempre disponível
- **RNF 3.6** Todos os forms devem ter botão de cancelar

### RNF 4 - Design System
- **RNF 4.1** Paleta de cores verde sustentável:
  - Verde primário: #1d7a3d
  - Verde secundário: #2e9e57
  - Verde claro/acentu: #4ecb71
  - Gradiente: linear-gradient(135deg, #2e9e57 0%, #1d7a3d 100%)
- **RNF 4.2** Fonte padrão: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **RNF 4.3** Ícones devem usar emojis para consistência
- **RNF 4.4** Todas as páginas devem usar tema verde sustentável
- **RNF 4.5** Sombras e bordas deve seguir padrão moderno (8px border-radius)
- **RNF 4.6** Espaçamento deve ser consistente (múltiplos de 0.5rem)

### RNF 5 - Segurança
- **RNF 5.1** Senhas devem ser validadas com força mínima:
  - Mínimo 8 caracteres
  - Maiúsculas obrigatórias
  - Minúsculas obrigatórias
  - Números obrigatórios
  - Caracteres especiais obrigatórios (@$!%*?&)
- **RNF 5.2** Token JWT deve ser armazenado de forma segura
- **RNF 5.3** Senhas nunca devem ser exibidas em plain text (exceto com toggle)
- **RNF 5.4** Validação de CPF e CNPJ deve ser feita no frontend
- **RNF 5.5** Requisições devem incluir token no header Authorization
- **RNF 5.6** Rotas protegidas devem redirecionar para login se não autenticado

### RNF 6 - Validação de Dados
- **RNF 6.1** Email deve ser validado com formato RFC 5322
- **RNF 6.2** CPF deve conter 11 dígitos numéricos
- **RNF 6.3** CNPJ deve conter 14 dígitos numéricos
- **RNF 6.4** CEP deve conter 8 dígitos numéricos
- **RNF 6.5** Telefone deve conter 10-11 dígitos
- **RNF 6.6** Longitude/Latitude devem ser números válidos
- **RNF 6.7** URLs de fotos devem ser URLs válidas

### RNF 7 - Compatibilidade
- **RNF 7.1** Aplicação deve funcionar em:
  - Chrome (versões recentes)
  - Firefox (versões recentes)
  - Safari (versões recentes)
  - Edge (versões recentes)
- **RNF 7.2** Deve suportar mobile browsers (iOS Safari, Chrome Mobile)
- **RNF 7.3** JavaScript ES6+ é suportado

### RNF 8 - Acessibilidade
- **RNF 8.1** Todos os inputs devem ter labels associados
- **RNF 8.2** Cores não devem ser o único meio de comunicar informação
- **RNF 8.3** Contraste deve ter razão mínima 4.5:1 para texto
- **RNF 8.4** Links devem ser claramente identificáveis
- **RNF 8.5** Navegação por teclado deve ser suportada

### RNF 9 - Integração com Backend
- **RNF 9.1** API base: configurada em services/api.js com Axios
- **RNF 9.2** Endpoints esperados:
  - POST /api/auth/login - autenticação
  - POST /api/empresas - registro de empresa
  - POST /api/pessoas-fisicas - registro de pessoa física
  - GET /api/pracas - listar praças
  - POST /api/pracas - criar praça
  - GET /api/pracas/:id - detalhes da praça
  - POST /api/adocao/interesse - manifestar interesse
  - GET /api/adocao/minhas-propostas - propostas da empresa
  - POST /api/propostas - criar proposta
  - GET /api/propostas - listar todas (ADMIN)
  - PATCH /api/propostas/:id - atualizar status
- **RNF 9.3** Todas as requisições devem incluir tratamento de erro
- **RNF 9.4** Resposta do servidor deve ser JSON

### RNF 10 - Gerenciamento de Estado
- **RNF 10.1** Autenticação gerenciada por AuthContext
- **RNF 10.2** Formik usado para gerenciar estado de formulários
- **RNF 10.3** React Hooks (useState, useEffect, useCallback) para lógica
- **RNF 10.4** React Router para navegação e rotas protegidas

### RNF 11 - Code Quality
- **RNF 11.1** Componentes devem ser funcionais (não class components)
- **RNF 11.2** CSS Modules para evitar conflitos de estilo
- **RNF 11.3** Nomes de variáveis/funções em português ou inglês consistente
- **RNF 11.4** Comentários em código quando lógica é complexa
- **RNF 11.5** PropTypes ou TypeScript (if applicable)

### RNF 12 - Temas Visuais
- **RNF 12.1** Todos os backgrounds devem usar gradientes sustentáveis
- **RNF 12.2** Cards e containers devem ter sombras sutis
- **RNF 12.3** Hover states devem ser claramente visíveis
- **RNF 12.4** Transições suave entre estados (0.2s-0.3s)
- **RNF 12.5** Loading spinners devem girar continuamente
- **RNF 12.6** Toasts devem aparecer com animação slide-in

### RNF 13 - Documentação
- **RNF 13.1** README.md com instruções de setup
- **RNF 13.2** Comentários JSDoc em funções importantes
- **RNF 13.3** Estrutura de pastas documentada
- **RNF 13.4** Requisitos listados em REQUISITOS.md

### RNF 14 - Internacionalização (i18n)
- **RNF 14.1** Interface em português (pt-BR)
- **RNF 14.2** Datas em formato brasileiro (DD/MM/YYYY)
- **RNF 14.3** Moeda em Real (R$) se necessário

### RNF 15 - Animações
- **RNF 15.1** Animação de loading: spin infinito
- **RNF 15.2** Animação de erro: slideDown suave
- **RNF 15.3** Animação de sucesso: slideInRight com toast
- **RNF 15.4** Hover effects com transform e shadow
- **RNF 15.5** Transições não devem ultrapassar 0.3s

---

## Matriz de Rastreabilidade

| Feature | RF | RNF | Componente |
|---------|----|----|-----------|
| Login | RF 1.1-1.6 | RNF 5, 6, 10 | Login.js |
| Cadastro Empresa | RF 2.1 | RNF 3, 4, 6, 10 | Register.js |
| Cadastro Pessoa | RF 2.2 | RNF 3, 4, 6, 10 | RegisterPessoaFisica.js |
| Listar Praças | RF 3.1 | RNF 1, 2, 4, 10 | PracaList.js |
| Cadastrar Praça | RF 3.2 | RNF 3, 4, 6, 10 | PracaForm.js |
| Detalhes Praça | RF 3.3 | RNF 2, 4, 10 | PracaDetail.js |
| Manifestar Interesse | RF 4 | RNF 3, 4, 6, 10 | ManifestacaoInteresse.js |
| Propostas (Empresa) | RF 5.2 | RNF 2, 4, 10 | MinhasPropostas.js |
| Minhas Adoções | RF 5.2 | RNF 2, 4, 10 | MinhasAdocoes.js |
| Gerenciar Propostas | RF 6 | RNF 2, 4, 10 | GerenciamentoPropostas.js |
| Landing Page | RF 8 | RNF 2, 4, 9 | Landing.js |
| Header/Layout | RF 9 | RNF 4, 9, 10 | AppLayout.js |

---

## Fluxos Principais

### Fluxo 1: Cadastro de Empresa → Adoção de Praça
1. Usuário acessa Landing (/landing)
2. Clica em "Cadastro de Empresa"
3. Preenche formulário com validações (RF 2.1, RNF 6)
4. Cadastro bem-sucedido, redireciona para login
5. Realiza login (RF 1.1-1.3)
6. Navega para Praças (RF 3.1)
7. Seleciona praça e visualiza detalhes (RF 3.3)
8. Clica "Manifestar Interesse" (RF 4)
9. Preenche descrição de projeto
10. Sucesso notificado, volta para detalhes

### Fluxo 2: Administrador Gerencia Praças
1. Admin faz login (RF 1.1-1.3)
2. Navega para "Gerenciar Praças" (RF 9.1)
3. Pode criar nova praça (RF 3.2)
4. Ou visualizar lista existente (RF 3.1)
5. Admin navega para "Gerenciar Propostas" (RF 9.1)
6. Visualiza todas as propostas (RF 6)
7. Aprova/rejeita propostas (RF 6.3)

### Fluxo 3: Pessoa Física Explora Praças
1. Usuário acessa Landing
2. Cadastra como Pessoa Física (RF 2.2)
3. Faz login
4. Navega para Praças (visualização apenas, sem manifestação)
5. Pode ver detalhes (RF 3.3)
6. Vê restrição de acesso para ações de adoção

---

## Notas Importantes

- Todas as validações usam Yup schemas
- Tema verde sustentável deve ser consistente
- Responsividade é crítica em todos os breakpoints
- Backend deve estar sincronizado com essas expectativas
- Tratamento de erro deve ser robusto e user-friendly

---

*Documento gerado em: 20 de Novembro de 2025*
*Versão: 1.0*
*Status: Completo*
