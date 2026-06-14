# 🌿 Communitex Frontend

Plataforma digital que conecta empresas, cidadãos e o poder público para facilitar a adoção e manutenção de praças e espaços públicos, promovendo cidades mais sustentáveis e alinhadas com a ODS 11.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Arquitetura](#arquitetura)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)

## 🎯 Sobre o Projeto

Communitex é uma solução inovadora que facilita a conexão entre empresas interessadas em adotar espaços públicos e a administração municipal. A plataforma oferece:

- **Para Empresas**: Capacidade de manifestar interesse e propor projetos de adoção de praças
- **Para Cidadãos**: Visualização de praças disponíveis e denúncia de problemas comunitários
- **Para Administradores**: Gerenciamento completo de praças, propostas e denúncias

## 🚀 Tecnologias

### Core
- **React 18+** - Biblioteca JavaScript para interfaces
- **React Router DOM** - Navegação e roteamento
- **Material UI (MUI) v5+** - Biblioteca de componentes UI
- **Axios** - Cliente HTTP para requisições à API

### Mapas e Geolocalização
- **Leaflet** - Biblioteca de mapas interativos
- **React Leaflet** - Integração do Leaflet com React

### Gerenciamento de Estado e Formulários
- **React Context API** - Gerenciamento de estado global (autenticação)
- **React Hooks** - useState, useEffect, useCallback, useMemo

### Estilização
- **Material UI System** - Sistema de estilos com `sx` prop
- **CSS-in-JS** - Estilos com theme e alpha utilities

## ✨ Funcionalidades

### Autenticação e Autorização
- ✅ Login com email e senha
- ✅ Registro de Empresas (ROLE_EMPRESA)
- ✅ Registro de Pessoas Físicas (ROLE_USER)
- ✅ Controle de acesso baseado em roles
- ✅ Persistência de sessão com JWT
- ✅ Rotas protegidas

### Gerenciamento de Praças
- ✅ Listagem de praças com filtros por status
- ✅ Visualização detalhada de praças
- ✅ Cadastro de novas praças (Admin/User)
- ✅ Marcação por ponto ou desenho do polígono da praça no mapa
- ✅ Sistema de status (Disponível, Em Processo, Adotada)

### Sistema de Adoção
- ✅ Manifestação de interesse (Empresas)
- ✅ Proposta formal de adoção
- ✅ Acompanhamento de propostas enviadas
- ✅ Gerenciamento de propostas (Admin)
- ✅ Histórico de interesses por praça
- ✅ Sistema de aprovação/rejeição com confirmação

### Denúncias Comunitárias
- ✅ Mapa interativo de denúncias
- ✅ Criação de denúncias georeferenciadas
- ✅ Lista de denúncias com filtros e busca
- ✅ Diferentes tipos de problemas (iluminação, buracos, lixo, etc)
- ✅ Sistema de apoio e comentários
- ✅ Busca por proximidade com fallback
- ✅ Alertas de status e warnings

### Interface e UX
- ✅ Design system com tema verde sustentável
- ✅ Layout responsivo (mobile, tablet, desktop)
- ✅ Sidebar retrátil com navegação
- ✅ Loading states e error handling
- ✅ Notificações com Snackbar/Alert
- ✅ Confirmações com Dialog
- ✅ Estados vazios informativos

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Admin/          # Componentes administrativos
│   │   └── GerenciamentoPropostas.js
│   ├── Adocao/         # Sistema de adoção
│   │   ├── ManifestacaoInteresse.js
│   │   ├── MinhasAdocoes.js
│   │   ├── MinhasPropostas.js
│   │   └── PropostaAdocaoForm.js
│   ├── Auth/           # Controle de acesso
│   │   ├── AdminRoute.js
│   │   ├── ProtectedRoute.js
│   │   └── UserRoute.js
│   ├── CommunityMap/   # Sistema de denúncias
│   │   ├── CommunityMap.js
│   │   ├── IssueCard.js
│   │   ├── IssueFormModal.js
│   │   └── IssueList.js
│   ├── common/         # Componentes reutilizáveis
│   │   ├── EmptyState.js
│   │   ├── LoadingState.js
│   │   ├── PageHeader.js
│   │   └── StatusChip.js
│   ├── Landing/        # Landing page
│   ├── Layout/         # Layouts
│   │   └── AppLayout.js
│   ├── Login/          # Autenticação
│   ├── Pracas/         # Gerenciamento de praças
│   │   ├── PracaDetail.js
│   │   ├── PracaForm.js
│   │   └── PracaList.js
│   └── Register/       # Cadastro
│       ├── Register.js
│       └── RegisterPessoaFisica.js
├── constants/          # Constantes e configurações
│   ├── index.js
│   ├── issueTypes.js   # Tipos de denúncias
│   ├── pracaOptions.js # Opções de praças
│   └── statusConfig.js # Configurações de status
├── context/            # Contextos React
│   └── AuthContext.js  # Contexto de autenticação
├── hooks/              # Custom Hooks
│   ├── useIssuesMap.js # Hook para gerenciar denúncias
│   └── useUserLocation.js # Hook de geolocalização
├── routes/             # Configuração de rotas
│   ├── index.js
│   └── paths.js        # Constantes de rotas
├── services/           # Serviços e APIs
│   ├── api.js          # Cliente Axios configurado
│   ├── IssueService.js # Serviço de denúncias
│   ├── PracaService.js # Serviço de praças
│   └── localStorageService.js
├── theme/              # Tema Material UI
│   └── index.js        # Configuração do tema
├── utils/              # Utilitários
│   ├── formatters.js   # Formatadores de data/texto
│   └── index.js
└── App.js              # Componente raiz
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 14+
- npm ou yarn
- Backend Communitex rodando (ver repositório backend)

### Passos

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd communitex-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuração

### API Base URL

Configure a URL da API em `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080', // Altere conforme necessário
});
```

### Tema

Personalize o tema em `src/theme/index.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1d7a3d',
      dark: '#145a2d',
      light: '#2e9e57',
    },
    // ...
  },
});
```

## 📜 Scripts Disponíveis

### `npm start`
Executa a aplicação em modo de desenvolvimento.
- Abre [http://localhost:3000](http://localhost:3000)
- Hot reload ativo
- Erros de lint visíveis no console

### `npm test`
Executa os testes em modo interativo.

### `npm run build`
Cria build otimizado para produção na pasta `build/`.
- Minificação automática
- Otimização de assets
- Source maps gerados

### `npm run eject`
**Atenção**: Operação irreversível!
Ejeta as configurações do Create React App para controle total.

## 🏗️ Arquitetura

### Padrão de Componentes

O projeto utiliza **Componentes Funcionais** com Hooks:

```javascript
const MeuComponente = () => {
  const [estado, setEstado] = useState(valorInicial);
  
  useEffect(() => {
    // Efeitos colaterais
  }, [dependencias]);
  
  return <Box>...</Box>;
};
```

### Gerenciamento de Estado

- **Global**: Context API (`AuthContext`)
- **Local**: useState, useReducer
- **Memoização**: useMemo, useCallback

### Roteamento

Rotas centralizadas em `src/routes/paths.js`:

```javascript
export const PROTECTED_ROUTES = {
  PRACAS: '/pracas',
  DENUNCIAS: '/denuncias',
  // ...
};
```

### Estilização

Material UI com `sx` prop:

```javascript
<Box sx={{ 
  p: 2, 
  bgcolor: 'primary.main',
  borderRadius: 2 
}}>
```

### Serviços

Camada de abstração para APIs:

```javascript
// services/PracaService.js
export const PracaService = {
  findAll: () => api.get('/api/pracas'),
  findById: (id) => api.get(`/api/pracas/${id}`),
  create: (data) => api.post('/api/pracas', data),
};
```

## 👨‍💻 Guia de Desenvolvimento

### Criando um Novo Componente

1. Crie o arquivo em `src/components/[Categoria]/`
2. Use componentes Material UI ao invés de HTML puro:
   - `<Box>` ao invés de `<div>`
   - `<Typography>` ao invés de `<p>`, `<h1>`, etc.
   - `<Stack>` para layouts flex
   - `<Grid>` para layouts grid

3. Exemplo básico:

```javascript
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const MeuComponente = () => {
  const [count, setCount] = useState(0);
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Contador: {count}
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => setCount(count + 1)}
      >
        Incrementar
      </Button>
    </Box>
  );
};

export default MeuComponente;
```

### Adicionando uma Nova Rota

1. Defina a rota em `src/routes/paths.js`:
```javascript
export const PROTECTED_ROUTES = {
  // ...
  NOVA_ROTA: '/nova-rota',
};
```

2. Adicione no `src/App.js`:
```javascript
<Route 
  path={PROTECTED_ROUTES.NOVA_ROTA} 
  element={<ProtectedLayout><NovoComponente /></ProtectedLayout>} 
/>
```

### Fazendo Requisições à API

```javascript
import api from '../services/api';

const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (err) {
    console.error('Erro:', err);
    setError('Mensagem amigável');
  }
};
```

### Usando Constantes Compartilhadas

```javascript
import { getIssueStatusConfig, getPropostaStatusConfig } from '../constants/statusConfig';
import { ISSUE_TYPES } from '../constants/issueTypes';
import { PROTECTED_ROUTES } from '../routes/paths';

const statusConfig = getIssueStatusConfig(issue.status);
const typeConfig = ISSUE_TYPES[issue.tipo];
```

## 📝 Padrões de Código

### Nomenclatura

- **Componentes**: PascalCase (`PracaList.js`)
- **Hooks**: camelCase com prefixo `use` (`useIssuesMap.js`)
- **Constantes**: UPPER_SNAKE_CASE (`ISSUE_TYPES`)
- **Funções**: camelCase (`fetchPropostas`)

### Organização de Imports

```javascript
// 1. React e bibliotecas externas
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Material UI
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// 3. Hooks e contextos
import { useAuth } from '../../context/AuthContext';

// 4. Serviços
import api from '../../services/api';

// 5. Componentes locais
import ComponenteLocal from './ComponenteLocal';

// 6. Constantes e utils
import { ROUTES } from '../../constants';
```

### Estrutura de Componente

```javascript
const MeuComponente = () => {
  // 1. Hooks e contextos
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 2. Estado
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 3. Effects
  useEffect(() => {
    fetchData();
  }, []);
  
  // 4. Funções auxiliares
  const fetchData = async () => {
    // ...
  };
  
  // 5. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 6. Render condicional
  if (loading) return <LoadingState />;
  
  // 7. JSX
  return (
    <Box>
      {/* Conteúdo */}
    </Box>
  );
};

export default MeuComponente;
```

### Boas Práticas

✅ **Fazer**:
- Use Material UI para todos os componentes visuais
- Implemente loading states e error handling
- Use constantes compartilhadas
- Memoize cálculos pesados com `useMemo`
- Use `useCallback` para funções em dependências
- Valide dados no frontend
- Trate erros da API de forma amigável
- Use rotas centralizadas de `paths.js`

❌ **Evitar**:
- Usar `<div>` e HTML puro (use `<Box>`)
- Hardcoded de strings de rotas
- Duplicar configurações (status, tipos, etc)
- `window.location.reload()` (use refetch functions)
- `alert()` (use Snackbar ou Dialog)
- CSS modules (use `sx` prop)
- Expor dados sensíveis no console

### Tratamento de Erros

```javascript
// ✅ Bom
try {
  const response = await api.get('/endpoint');
  setData(response.data);
  setError(null);
} catch (err) {
  console.error('Erro ao buscar dados:', err);
  const message = err.response?.data?.message || 'Erro ao carregar dados';
  setError(message);
}

// ❌ Evitar
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (err) {
  alert('Erro!'); // Não usar alert
}
```

## 🎨 Design System

### Paleta de Cores

- **Primary**: `#1d7a3d` (Verde principal)
- **Primary Dark**: `#145a2d`
- **Primary Light**: `#2e9e57`
- **Secondary**: `#4ecb71`
- **Error**: `#d32f2f`
- **Warning**: `#ed6c02`
- **Info**: `#0288d1`
- **Success**: `#2e7d32`

### Gradientes

```javascript
background: 'linear-gradient(135deg, #1d7a3d 0%, #2e9e57 100%)'
```

### Espaçamento

Use múltiplos de 8px (sistema MUI):
- `spacing(1)` = 8px
- `spacing(2)` = 16px
- `spacing(3)` = 24px

```javascript
<Box sx={{ p: 2, mb: 3 }}> {/* padding: 16px, margin-bottom: 24px */}
```

### Tipografia

```javascript
<Typography variant="h4" fontWeight={700}>  // Título
<Typography variant="h6" fontWeight={600}>  // Subtítulo
<Typography variant="body1">               // Texto normal
<Typography variant="body2">               // Texto menor
<Typography variant="caption">             // Legendas
```

## 🔐 Segurança

- Tokens JWT armazenados no localStorage
- Headers de autorização automáticos via interceptor Axios
- Rotas protegidas com redirecionamento
- Validação de entrada no frontend
- Senhas nunca expostas em logs

## 📱 Responsividade

Breakpoints Material UI:
- **xs**: 0-599px (mobile)
- **sm**: 600-959px (tablet small)
- **md**: 960-1279px (tablet/desktop)
- **lg**: 1280-1919px (desktop)
- **xl**: 1920px+ (large desktop)

```javascript
<Box sx={{ 
  p: { xs: 1, sm: 2, md: 3 },  // Padding responsivo
  display: { xs: 'block', md: 'flex' }  // Layout adaptativo
}}>
```

## 🐛 Debugging

### Console de Desenvolvimento

```javascript
console.log('Debug:', data);      // Desenvolvimento
console.error('Erro:', error);    // Erros
console.warn('Aviso:', warning);  // Avisos
```

### React DevTools

Instale a extensão React DevTools para:
- Inspecionar árvore de componentes
- Verificar props e state
- Analisar performance

## 📚 Recursos Adicionais

- [Documentação React](https://react.dev/)
- [Material UI Docs](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [Leaflet](https://leafletjs.com/)
- [Axios](https://axios-http.com/)

## 📄 Licença

Este projeto faz parte do Projeto Aplicado SENAI.

## 👥 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
3. Push para a branch (`git push origin feature/nova-feature`)
4. Abra um Pull Request

---

**Desenvolvido com 💚 para cidades mais sustentáveis**
