import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PROTECTED_ROUTES, ADMIN_ROUTES, PUBLIC_ROUTES } from '../../routes/paths';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  alpha,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Park as ParkIcon,
  Assignment as AssignmentIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  ReportProblem as ReportIcon,
  Person as PersonIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  EnergySavingsLeaf as LeafIcon,
} from '@mui/icons-material';

const drawerWidthExpanded = 264;
const drawerWidthCollapsed = 72;

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);

  const drawerWidth = drawerCollapsed ? drawerWidthCollapsed : drawerWidthExpanded;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDrawerCollapse = () => setDrawerCollapsed(!drawerCollapsed);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isEmpresa = user?.roles?.includes('ROLE_EMPRESA');

  const roleLabel = isAdmin ? 'Administrador' : isEmpresa ? 'Empresa' : 'Usuário';
  const roleColor = isAdmin ? 'secondary' : 'primary';

  const menuItems = [
    { text: 'Ver Praças', icon: <ParkIcon />, path: PROTECTED_ROUTES.PRACAS, show: true },
    { text: 'Denúncias Comunitárias', icon: <ReportIcon />, path: PROTECTED_ROUTES.DENUNCIAS, show: true },
    { text: 'Minhas Propostas', icon: <AssignmentIcon />, path: PROTECTED_ROUTES.MINHAS_PROPOSTAS, show: isEmpresa },
    { text: 'Gerenciar Propostas', icon: <AdminIcon />, path: ADMIN_ROUTES.PROPOSTAS, show: isAdmin },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === PROTECTED_ROUTES.PRACAS) return 'Praças';
    if (path === PROTECTED_ROUTES.DENUNCIAS) return 'Denúncias Comunitárias';
    if (path === PROTECTED_ROUTES.DENUNCIAS_LISTA) return 'Lista de Denúncias';
    if (path === PROTECTED_ROUTES.MINHAS_PROPOSTAS) return 'Minhas Propostas';
    if (path === ADMIN_ROUTES.PROPOSTAS) return 'Gerenciar Propostas';
    if (path === ADMIN_ROUTES.NOVA_PRACA) return 'Nova Praça';
    if (path.startsWith('/pracas/') && path.includes('/manifestar-interesse')) return 'Manifestar Interesse';
    if (path.startsWith('/pracas/') && path.includes('/propor-adocao')) return 'Propor Adoção';
    if (path.startsWith('/pracas/')) return 'Detalhes da Praça';
    if (path.startsWith('/admin')) return 'Administração';
    return 'Communitex';
  }, [location.pathname]);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Header do Drawer */}
      <Box
        sx={{
          p: drawerCollapsed ? 1 : 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: drawerCollapsed ? 'center' : 'space-between',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          minHeight: 68,
        }}
      >
        {!drawerCollapsed && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <LeafIcon sx={{ fontSize: 22 }} />
            <Typography variant="h6" fontWeight={800} letterSpacing="-0.3px">
              Communitex
            </Typography>
          </Stack>
        )}
        {drawerCollapsed && <LeafIcon sx={{ fontSize: 26 }} />}
        {isMobile ? (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleDrawerCollapse}
            sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.12) } }}
          >
            {drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      {/* Usuário */}
      <Box
        sx={{
          p: drawerCollapsed ? 1 : 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          justifyContent={drawerCollapsed ? 'center' : 'flex-start'}
        >
          <Tooltip title={drawerCollapsed ? (user?.username || user?.sub || 'Usuário') : ''} placement="right">
            <Avatar
              sx={{
                bgcolor: theme.palette[roleColor].main,
                width: 40,
                height: 40,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {(user?.username || user?.sub || 'U')[0].toUpperCase()}
            </Avatar>
          </Tooltip>
          {!drawerCollapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                {user?.username || user?.sub || 'Usuário'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {roleLabel}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Navegação */}
      <List sx={{ flex: 1, px: drawerCollapsed ? 0.75 : 1.5, py: 1.5 }}>
        {menuItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={drawerCollapsed ? item.text : ''} placement="right">
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      justifyContent: drawerCollapsed ? 'center' : 'flex-start',
                      px: drawerCollapsed ? 1.5 : 2,
                      py: 1.25,
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.dark',
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) },
                      },
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: drawerCollapsed ? 0 : 40,
                        mr: drawerCollapsed ? 0 : 'auto',
                        color: isActive ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!drawerCollapsed && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
      </List>

      <Divider />

      {/* Logout */}
      <List sx={{ px: drawerCollapsed ? 0.75 : 1.5, py: 1 }}>
        <ListItem disablePadding>
          <Tooltip title={drawerCollapsed ? 'Sair' : ''} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                justifyContent: drawerCollapsed ? 'center' : 'flex-start',
                color: 'error.main',
                py: 1.25,
                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) },
              }}
            >
              <ListItemIcon sx={{ minWidth: drawerCollapsed ? 0 : 40, color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              {!drawerCollapsed && (
                <ListItemText primary="Sair" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  const isMapPage = location.pathname === PROTECTED_ROUTES.DENUNCIAS;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 68 }}>
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {pageTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.85 }}>
            Olá, {user?.username || user?.sub || 'Usuário'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidthExpanded },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMapPage ? 0 : 3,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          bgcolor: isMapPage ? 'transparent' : 'background.default',
          minHeight: '100vh',
          mt: '68px',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
