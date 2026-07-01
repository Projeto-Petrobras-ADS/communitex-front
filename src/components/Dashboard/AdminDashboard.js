import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import {
  AdminPanelSettingsOutlined,
  AssignmentOutlined,
  CampaignOutlined,
  DeleteOutline,
  MapOutlined,
  ParkOutlined,
  PlaylistAddOutlined,
} from '@mui/icons-material';
import api from '../../services/api';
import DashboardService from '../../services/DashboardService';
import { getPracaStatusConfig, getPropostaStatusConfig } from '../../constants/statusConfig';
import { PageHeader, LoadingState, MetricCard, StatusChip } from '../common';

const pageContent = (response) => response.data?.content || response.data || [];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publicDashboard, setPublicDashboard] = useState(null);
  const [pracas, setPracas] = useState([]);
  const [propostas, setPropostas] = useState([]);
  const [denuncias, setDenuncias] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [dashboardResponse, pracasResponse, propostasResponse, denunciasResponse] = await Promise.all([
        DashboardService.obterDashboardPublico(),
        api.get('/api/pracas'),
        api.get('/api/propostas'),
        api.get('/api/issues'),
      ]);
      setPublicDashboard(dashboardResponse);
      setPracas(pageContent(pracasResponse));
      setPropostas(propostasResponse.data || []);
      setDenuncias(pageContent(denunciasResponse));
      setError('');
    } catch (err) {
      setError(err.message || 'Não foi possível carregar o painel administrativo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const propostasPendentes = useMemo(
    () => propostas.filter((proposta) => ['PROPOSTA', 'EM_ANALISE'].includes(proposta.status)),
    [propostas]
  );

  const pracasPorStatus = useMemo(() => (
    pracas.reduce((acc, praca) => ({ ...acc, [praca.status]: (acc[praca.status] || 0) + 1 }), {})
  ), [pracas]);

  if (loading) return <LoadingState message="Carregando painel administrativo..." />;

  return (
    <Box>
      <PageHeader
        title="Painel do administrador"
        subtitle="Acompanhe a operação da plataforma e acesse as principais ações de gestão."
        icon={AdminPanelSettingsOutlined}
        actions={[
          <Button key="nova-praca" component={Link} to="/admin/pracas/nova" variant="contained" startIcon={<PlaylistAddOutlined />}>Nova praça</Button>,
          <Button key="propostas" component={Link} to="/admin/propostas" variant="outlined" startIcon={<AssignmentOutlined />}>Analisar propostas</Button>,
        ]}
      />

      {error && <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" onClick={load}>Tentar novamente</Button>}>{error}</Alert>}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Praças cadastradas" value={publicDashboard?.totalPracas ?? pracas.length} helper={`${pracasPorStatus.DISPONIVEL || 0} disponíveis`} icon={ParkOutlined} color="primary" onClick={() => navigate('/pracas')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Denúncias" value={publicDashboard?.totalDenuncias ?? denuncias.length} helper="Demandas comunitárias" icon={CampaignOutlined} color="error" onClick={() => navigate('/denuncias')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Propostas pendentes" value={propostasPendentes.length} helper="Aguardando análise" icon={AssignmentOutlined} color="warning" onClick={() => navigate('/admin/propostas')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard label="Ações rápidas" value="3" helper="Gestão operacional" icon={AdminPanelSettingsOutlined} color="success" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Ações administrativas</Typography>
              <Stack spacing={1.25}>
                <Button component={Link} to="/pracas" variant="outlined" startIcon={<DeleteOutline />} fullWidth sx={{ justifyContent: 'flex-start' }}>
                  Gerenciar e excluir praças
                </Button>
                <Button component={Link} to="/admin/propostas" variant="outlined" startIcon={<AssignmentOutlined />} fullWidth sx={{ justifyContent: 'flex-start' }}>
                  Aprovar ou rejeitar propostas
                </Button>
                <Button component={Link} to="/denuncias/lista" variant="outlined" startIcon={<MapOutlined />} fullWidth sx={{ justifyContent: 'flex-start' }}>
                  Gerenciar denúncias
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={800}>Propostas recentes</Typography>
                <Button component={Link} to="/admin/propostas" size="small">Ver todas</Button>
              </Stack>
              {propostas.length === 0 ? (
                <Typography color="text.secondary">Nenhuma proposta registrada.</Typography>
              ) : (
                <List disablePadding>
                  {propostas.slice(0, 5).map((proposta) => (
                    <ListItem key={proposta.id} disablePadding divider>
                      <ListItemButton onClick={() => navigate('/admin/propostas')}>
                        <ListItemText
                          primary={proposta.pracaNome || proposta.nomePraca || `Praça ${proposta.pracaId}`}
                          secondary={proposta.empresaNomeFantasia || proposta.empresaNome || `Empresa ${proposta.empresaId}`}
                          primaryTypographyProps={{ fontWeight: 700 }}
                        />
                        <StatusChip status={proposta.status} config={getPropostaStatusConfig(proposta.status)} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Resumo das praças</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {Object.entries(pracasPorStatus).map(([status, total]) => (
                  <StatusChip
                    key={status}
                    status={status}
                    config={{ ...getPracaStatusConfig(status), label: `${getPracaStatusConfig(status).label}: ${total}` }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
