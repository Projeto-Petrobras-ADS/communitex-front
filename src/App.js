import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import theme from './theme';

// Routes
import { PUBLIC_ROUTES, PROTECTED_ROUTES, ADMIN_ROUTES, USER_ROUTES } from './routes/paths';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout
import AppLayout from './components/Layout/AppLayout';

// Pages - Auth
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import RegisterPessoaFisica from './components/Register/RegisterPessoaFisica';
import { Landing } from './components/Landing/Landing';

// Pages - Praças
import PracaList from './components/Pracas/PracaList';
import PracaDetail from './components/Pracas/PracaDetail';
import PracaForm from './components/Pracas/PracaForm';

// Pages - Adoção
import MinhasPropostas from './components/Adocao/MinhasPropostas';
import ManifestacaoInteresse from './components/Adocao/ManifestacaoInteresse';

// Pages - Admin
import GerenciamentoPropostas from './components/Admin/GerenciamentoPropostas';

// Pages - Community Map
import { CommunityMap, IssueList } from './components/CommunityMap';

// Route Guards
import AdminRoute from './components/Auth/AdminRoute';
import UserRoute from './components/Auth/UserRoute';
import EmpresaRoute from './components/Auth/EmpresaRoute';

/**
 * Componente de Rota Protegida
 * Redireciona para landing se não autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to={PUBLIC_ROUTES.HOME} replace />;
};

/**
 * Wrapper de layout para rotas protegidas
 */
const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const LegacyProposalRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/pracas/${id}/manifestar-interesse`} replace />;
};

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/* === ROTAS PÚBLICAS === */}
            <Route path={PUBLIC_ROUTES.HOME} element={<Landing />} />
            <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
            <Route path={PUBLIC_ROUTES.REGISTER} element={<Register />} />
            <Route path={PUBLIC_ROUTES.REGISTER_PESSOA_FISICA} element={<RegisterPessoaFisica />} />

            {/* === ROTAS PROTEGIDAS === */}
            <Route path={PROTECTED_ROUTES.PRACAS} element={<ProtectedLayout><PracaList /></ProtectedLayout>} />
            <Route path={PROTECTED_ROUTES.PRACA_DETAIL} element={<ProtectedLayout><PracaDetail /></ProtectedLayout>} />
            <Route path={PROTECTED_ROUTES.PRACA_MANIFESTAR} element={<EmpresaRoute><AppLayout><ManifestacaoInteresse /></AppLayout></EmpresaRoute>} />
            <Route path={PROTECTED_ROUTES.PRACA_PROPOR} element={<EmpresaRoute><LegacyProposalRedirect /></EmpresaRoute>} />
            <Route path={PROTECTED_ROUTES.MINHAS_PROPOSTAS} element={<EmpresaRoute><AppLayout><MinhasPropostas /></AppLayout></EmpresaRoute>} />
            <Route path={PROTECTED_ROUTES.DASHBOARD} element={<Navigate to={PROTECTED_ROUTES.PRACAS} replace />} />

            {/* === ROTAS DE ADMIN === */}
            <Route path={ADMIN_ROUTES.NOVA_PRACA} element={<AdminRoute><AppLayout><PracaForm /></AppLayout></AdminRoute>} />
            <Route path={ADMIN_ROUTES.PROPOSTAS} element={<AdminRoute><AppLayout><GerenciamentoPropostas /></AppLayout></AdminRoute>} />

            {/* === ROTAS PARA ROLE_USER === */}
            <Route path={USER_ROUTES.NOVA_PRACA} element={<UserRoute><AppLayout><PracaForm /></AppLayout></UserRoute>} />

            {/* === DENÚNCIAS COMUNITÁRIAS === */}
            <Route path={PROTECTED_ROUTES.DENUNCIAS} element={<ProtectedLayout><CommunityMap /></ProtectedLayout>} />
            <Route path={PROTECTED_ROUTES.DENUNCIAS_LISTA} element={<ProtectedLayout><IssueList /></ProtectedLayout>} />
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
