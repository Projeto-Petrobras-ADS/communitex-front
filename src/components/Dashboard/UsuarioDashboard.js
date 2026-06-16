import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Divider, Grid, LinearProgress, List, ListItem, ListItemText,
  Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import {
  AddLocationAltOutlined, ArrowForward, CampaignOutlined, CheckCircleOutline,
  CommentOutlined, DashboardOutlined, MapOutlined, ParkOutlined, ReportProblemOutlined,
  ThumbUpOutlined,
} from '@mui/icons-material';
import DashboardService from '../../services/DashboardService';
import { getIssueStatusConfig, getPracaStatusConfig } from '../../constants';
import { formatDate } from '../../utils';
import { LoadingState, MetricCard, PageHeader, StatusChip } from '../common';

const SectionHeader = ({ title, actionLabel, to }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
    <Typography variant="h6">{title}</Typography>
    <Button component={Link} to={to} endIcon={<ArrowForward />} size="small">{actionLabel}</Button>
  </Stack>
);

const UsuarioDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDashboard(await DashboardService.obterDashboardUsuario());
    } catch (err) {
      setError(err.message || 'Não foi possível carregar o painel do cidadão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <LoadingState message="Preparando seu painel comunitário..." />;

  if (error) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Painel do cidadão" icon={DashboardOutlined} />
        <Alert severity="error" action={<Button color="inherit" onClick={loadDashboard}>Tentar novamente</Button>}>{error}</Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Olá, ${dashboard.usuarioNome}`}
        subtitle="Acompanhe suas contribuições e o impacto da sua participação na comunidade."
        icon={DashboardOutlined}
        actions={[
          <Button key="park" component={Link} to="/user/pracas/nova" variant="outlined" startIcon={<AddLocationAltOutlined />}>Cadastrar praça</Button>,
          <Button key="issue" component={Link} to="/denuncias" variant="contained" startIcon={<CampaignOutlined />}>Registrar denúncia</Button>,
        ]}
      />

      {dashboard.confirmacoesPendentes > 0 && (
        <Alert severity="warning" action={<Button component={Link} to="/denuncias/lista">Ver denúncias</Button>}>
          Você possui {dashboard.confirmacoesPendentes} reparo(s) aguardando sua confirmação.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Praças cadastradas" value={dashboard.pracasCadastradas} helper={`${dashboard.pracasAdotadas} adotada(s)`} icon={ParkOutlined} color="success" onClick={() => navigate('/pracas')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Denúncias realizadas" value={dashboard.denunciasRealizadas} helper={`${dashboard.denunciasAbertas} aberta(s)`} icon={ReportProblemOutlined} color="error" onClick={() => navigate('/denuncias/lista')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Denúncias resolvidas" value={dashboard.denunciasResolvidas} helper={`${dashboard.taxaResolucao}% de resolução`} icon={CheckCircleOutline} color="primary" onClick={() => navigate('/denuncias/lista')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Apoios recebidos" value={dashboard.totalApoiosRecebidos} helper="Nas suas denúncias" icon={ThumbUpOutlined} color="warning" onClick={() => navigate('/denuncias/lista')} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
            <SectionHeader title="Minhas denúncias recentes" actionLabel="Ver todas" to="/denuncias/lista" />
            {dashboard.denunciasRecentes.length === 0 ? (
              <Typography color="text.secondary">Você ainda não registrou denúncias comunitárias.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Denúncia</TableCell><TableCell>Data</TableCell><TableCell>Apoios</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                  <TableBody>
                    {dashboard.denunciasRecentes.map((denuncia) => (
                      <TableRow hover key={denuncia.id} onClick={() => navigate(`/denuncias?lat=${denuncia.latitude}&lng=${denuncia.longitude}&issueId=${denuncia.id}`)} sx={{ cursor: 'pointer' }}>
                        <TableCell><Typography variant="body2" fontWeight={700}>{denuncia.titulo}</Typography><Typography variant="caption" color="text.secondary">{denuncia.tipo}</Typography></TableCell>
                        <TableCell>{formatDate(denuncia.dataCriacao)}</TableCell>
                        <TableCell>{denuncia.totalApoios || 0}</TableCell>
                        <TableCell><StatusChip status={denuncia.status} config={getIssueStatusConfig(denuncia.status)} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Participação comunitária</Typography>
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" justifyContent="space-between"><Typography variant="body2">Taxa de resolução</Typography><Typography fontWeight={700}>{dashboard.taxaResolucao}%</Typography></Stack>
              <LinearProgress variant="determinate" value={Math.min(dashboard.taxaResolucao, 100)} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {[
                [ThumbUpOutlined, 'Apoios realizados', dashboard.apoiosRealizados],
                [CommentOutlined, 'Comentários realizados', dashboard.comentariosRealizados],
                [MapOutlined, 'Denúncias em andamento', dashboard.denunciasEmAndamento],
                [CheckCircleOutline, 'Reparos confirmados', dashboard.reparosConfirmados],
                [ReportProblemOutlined, 'Reparos contestados', dashboard.reparosContestados],
              ].map(([Icon, label, value]) => (
                <Stack key={label} direction="row" spacing={1.5} alignItems="center">
                  <Icon color="primary" />
                  <Box sx={{ flex: 1 }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography fontWeight={700}>{value}</Typography></Box>
                </Stack>
              ))}
            </Stack>
            <Button component={Link} to="/denuncias" variant="outlined" fullWidth startIcon={<MapOutlined />} sx={{ mt: 3 }}>Ver demandas no mapa</Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <SectionHeader title="Minhas praças recentes" actionLabel="Visualizar catálogo" to="/pracas" />
        {dashboard.pracasRecentes.length === 0 ? (
          <Typography color="text.secondary">Você ainda não cadastrou praças.</Typography>
        ) : (
          <List disablePadding>
            {dashboard.pracasRecentes.map((praca, index) => (
              <React.Fragment key={praca.id}>
                {index > 0 && <Divider />}
                <ListItem disableGutters secondaryAction={<StatusChip status={praca.status} config={getPracaStatusConfig(praca.status)} />}>
                  <ListItemText
                    primary={praca.nome}
                    secondary={[praca.bairro, praca.cidade].filter(Boolean).join(' • ')}
                    primaryTypographyProps={{ fontWeight: 700, variant: 'body2' }}
                  />
                  <Button component={Link} to={`/pracas/${praca.id}`} size="small" sx={{ mr: 12 }}>Detalhes</Button>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Stack>
  );
};

export default UsuarioDashboard;
