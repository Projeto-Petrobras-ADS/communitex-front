import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Avatar, Box, Collapse, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Stack, Toolbar, Tooltip, Typography, useTheme,
} from '@mui/material';
import {
  AddLocationAltOutlined, AdminPanelSettings, Assignment, ChevronLeft, ChevronRight,
  DashboardOutlined, EnergySavingsLeaf, ExpandLess, ExpandMore, ListAltOutlined,
  Logout, MapOutlined, Menu, ParkOutlined, ReportProblemOutlined,
  BuildOutlined,
  ManageAccountsOutlined,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_ROUTES, PROTECTED_ROUTES } from '../../routes/paths';

const expandedWidth = 248;
const collapsedWidth = 72;

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const width = collapsed ? collapsedWidth : expandedWidth;

  const roles = user?.roles || [];
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isEmpresa = roles.includes('ROLE_EMPRESA');
  const isUser = roles.includes('ROLE_USER');
  const displayName = user?.username || user?.sub || 'Usuário';
  const roleLabel = isAdmin ? 'Administrador' : isEmpresa ? 'Empresa' : 'Cidadão';

  const menuGroups = useMemo(() => [
    {
      id: 'dashboard',
      label: isAdmin ? 'Painel administrativo' : isEmpresa ? 'Painel da empresa' : 'Painel do cidadão',
      icon: DashboardOutlined,
      show: isAdmin || isEmpresa || isUser,
      children: [
        { label: 'Visão geral', icon: DashboardOutlined, path: PROTECTED_ROUTES.DASHBOARD },
      ],
    },
    {
      id: 'conta',
      label: 'Conta',
      icon: ManageAccountsOutlined,
      show: isEmpresa || isUser,
      children: [
        { label: 'Meu perfil', icon: ManageAccountsOutlined, path: PROTECTED_ROUTES.PROFILE },
      ],
    },
    {
      id: 'pracas',
      label: 'Praças',
      icon: ParkOutlined,
      children: [
        { label: 'Visualizar praças', icon: ListAltOutlined, path: PROTECTED_ROUTES.PRACAS, match: (path) => path.startsWith('/pracas/') && !path.includes('/manifestar-interesse') },
        { label: 'Cadastrar praça', icon: AddLocationAltOutlined, path: isAdmin ? ADMIN_ROUTES.NOVA_PRACA : '/user/pracas/nova', show: isAdmin || isUser },
      ],
    },
    {
      id: 'denuncias',
      label: 'Denúncias',
      icon: ReportProblemOutlined,
      children: [
        { label: 'Visualizar denúncias', icon: ListAltOutlined, path: PROTECTED_ROUTES.DENUNCIAS_LISTA },
        { label: 'Mapa de denúncias', icon: MapOutlined, path: PROTECTED_ROUTES.DENUNCIAS },
      ],
    },
    {
      id: 'reparos',
      label: 'Reparos',
      icon: BuildOutlined,
      show: isEmpresa,
      children: [
        { label: 'Gerenciar reparos', icon: BuildOutlined, path: PROTECTED_ROUTES.REPAROS },
      ],
    },
    {
      id: 'propostas',
      label: 'Propostas',
      icon: Assignment,
      show: isEmpresa || isAdmin,
      children: [
        { label: 'Minhas propostas', icon: Assignment, path: PROTECTED_ROUTES.MINHAS_PROPOSTAS, show: isEmpresa, match: (path) => path.includes('/manifestar-interesse') },
        { label: 'Gerenciar propostas', icon: AdminPanelSettings, path: ADMIN_ROUTES.PROPOSTAS, show: isAdmin },
      ],
    },
  ].filter((group) => group.show !== false).map((group) => ({
    ...group,
    children: group.children.filter((item) => item.show !== false),
  })), [isAdmin, isEmpresa, isUser]);

  const allItems = useMemo(
    () => menuGroups.flatMap((group) => group.children),
    [menuGroups]
  );

  const pageTitle = useMemo(() => {
    const current = allItems.find((item) => item.path === location.pathname || item.match?.(location.pathname));
    return current?.label || 'Communitex';
  }, [allItems, location.pathname]);

  useEffect(() => {
    const activeGroup = menuGroups.find((group) => group.children.some(
      (item) => item.path === location.pathname || item.match?.(location.pathname)
    ));
    if (activeGroup) {
      setOpenGroups((current) => ({ ...current, [activeGroup.id]: true }));
    }
  }, [location.pathname, menuGroups]);

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isItemActive = (item) => location.pathname === item.path || item.match?.(location.pathname);

  const toggleGroup = (group) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroups((current) => ({ ...current, [group.id]: true }));
      return;
    }
    setOpenGroups((current) => ({ ...current, [group.id]: !current[group.id] }));
  };

  const renderItem = (item, nested = false) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return (
      <Tooltip key={`${item.label}-${item.path}`} title={collapsed ? item.label : ''} placement="right">
        <ListItemButton selected={active} onClick={() => go(item.path)} sx={{
          mb: 0.5,
          pl: collapsed ? 1.75 : nested ? 4.5 : 1.5,
          pr: collapsed ? 1.75 : 1.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
          color: active ? 'white' : '#d0d5dd',
          '&.Mui-selected': { bgcolor: '#344054', '&:hover': { bgcolor: '#344054' } },
          '&:hover': { bgcolor: '#1d2939' },
        }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed ? 0 : 38 }}><Icon fontSize="small" /></ListItemIcon>
          {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: nested ? 13.5 : 14, fontWeight: active ? 700 : 500 }} />}
        </ListItemButton>
      </Tooltip>
    );
  };

  const navigation = (
    <Stack sx={{ height: '100%', bgcolor: '#101828', color: 'white' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: 64, px: collapsed ? 1.5 : 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Avatar variant="rounded" sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}><EnergySavingsLeaf fontSize="small" /></Avatar>
          {!collapsed && <Typography fontWeight={800}>Communitex</Typography>}
        </Stack>
        <IconButton size="small" onClick={() => setCollapsed((value) => !value)} sx={{ color: '#98a2b3', display: { xs: 'none', md: 'inline-flex' } }}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</IconButton>
      </Stack>
      <Divider sx={{ borderColor: '#344054' }} />
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuGroups.map((group) => {
          const GroupIcon = group.icon;
          const groupActive = group.children.some(isItemActive);
          const groupOpen = Boolean(openGroups[group.id]);
          return (
            <Box key={group.id}>
              <Tooltip title={collapsed ? group.label : ''} placement="right">
                <ListItemButton onClick={() => toggleGroup(group)} sx={{
                  mb: 0.5, px: collapsed ? 1.75 : 1.5, justifyContent: collapsed ? 'center' : 'flex-start',
                  color: groupActive ? 'white' : '#d0d5dd', bgcolor: groupActive && !groupOpen ? '#1d2939' : 'transparent',
                  '&:hover': { bgcolor: '#1d2939' },
                }}>
                  <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed ? 0 : 38 }}><GroupIcon fontSize="small" /></ListItemIcon>
                  {!collapsed && <ListItemText primary={group.label} primaryTypographyProps={{ fontSize: 14, fontWeight: groupActive ? 700 : 500 }} />}
                  {!collapsed && (groupOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
                </ListItemButton>
              </Tooltip>
              {!collapsed && (
                <Collapse in={groupOpen} timeout="auto" unmountOnExit>
                  <List disablePadding>{group.children.map((item) => renderItem(item, true))}</List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
      <Divider sx={{ borderColor: '#344054' }} />
      <List sx={{ px: 1, py: 1 }}>
        <Tooltip title={collapsed ? 'Sair' : ''} placement="right">
          <ListItemButton onClick={() => { logout(); navigate('/'); }} sx={{ color: '#d0d5dd', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed ? 0 : 38 }}><Logout fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Sair" primaryTypographyProps={{ fontSize: 14 }} />}
          </ListItemButton>
        </Tooltip>
      </List>
    </Stack>
  );

  const isMap = location.pathname === PROTECTED_ROUTES.DENUNCIAS;
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="inherit" sx={{ width: { md: `calc(100% - ${width}px)` }, ml: { md: `${width}px` }, borderBottom: 1, borderColor: 'divider', transition: theme.transitions.create(['width', 'margin']) }}>
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, md: 3 } }}>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, mr: 1 }}><Menu /></IconButton>
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>{pageTitle}</Typography>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={700}>{displayName}</Typography>
              <Typography variant="caption" color="text.secondary">{roleLabel}</Typography>
            </Box>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>{displayName[0].toUpperCase()}</Avatar>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: expandedWidth } }}>{navigation}</Drawer>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width, border: 0, transition: theme.transitions.create('width'), overflowX: 'hidden' } }}>{navigation}</Drawer>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, width: { md: `calc(100% - ${width}px)` }, ml: { md: `${width}px` }, mt: '64px', p: isMap ? 0 : { xs: 2, sm: 3 }, transition: theme.transitions.create(['width', 'margin']) }}>
        <Box sx={{ maxWidth: isMap ? 'none' : 1440, mx: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
