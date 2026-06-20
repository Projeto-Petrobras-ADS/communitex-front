import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Divider, Grid,
  LinearProgress, List, ListItem, ListItemText, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import {
  ArrowForward, AssignmentOutlined,
  CheckCircleOutline, DashboardOutlined, HandshakeOutlined, ParkOutlined,
  SquareFootOutlined, TrendingUpOutlined, BuildOutlined, PendingActionsOutlined, ReportProblemOutlined,
} from '@mui/icons-material';
import DashboardService from '../../services/DashboardService';
import { resolveApiUrl } from '../../services/api';
import { getPropostaStatusConfig } from '../../constants';
import { formatDate, formatDateTime, formatNumber } from '../../utils';
import { EmptyState, LoadingState, MetricCard, PageHeader, StatusChip } from '../common';
import ProfileCompletionPrompt from '../Profile/ProfileCompletionPrompt';

const REPAIR_STATUS = {
  ACEITO: { label: 'Aceito', color: 'info' },
  EM_ANDAMENTO: { label: 'Em andamento', color: 'primary' },
  CONCLUIDO_PELA_EMPRESA: { label: 'Aguardando confirmação', color: 'warning' },
  CONFIRMADO_PELO_AUTOR: { label: 'Confirmado', color: 'success' },
  CONTESTADO: { label: 'Contestado', color: 'error' },
  CANCELADO: { label: 'Cancelado', color: 'default' },
};

const SectionHeader = ({ title, actionLabel, to }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
    <Typography variant="h6">{title}</Typography>
    {to && <Button component={Link} to={to} endIcon={<ArrowForward />} size="small">{actionLabel}</Button>}
  </Stack>
);

const EmpresaDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setDashboard(await DashboardService.obterDashboardEmpresa());
    } catch (err) {
      setError(err.message || 'Não foi possível carregar o painel da empresa.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <LoadingState message="Preparando o painel da sua empresa..." />;

  if (error) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Painel da empresa" icon={DashboardOutlined} />
        <Alert severity="error" action={<Button color="inherit" onClick={loadDashboard}>Tentar novamente</Button>}>{error}</Alert>
      </Stack>
    );
  }

  const hasAttention = dashboard.propostasEmAnalise > 0 || dashboard.adocoesProximasDoFim > 0 || dashboard.reparosAguardandoConfirmacao > 0 || dashboard.reparosContestados > 0;

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Olá, ${dashboard.empresaNome}`}
        subtitle="Acompanhe oportunidades, propostas e o impacto da sua empresa na comunidade."
        icon={DashboardOutlined}
        actions={[
          <Button key="repairs" component={Link} to="/reparos" variant="outlined" startIcon={<BuildOutlined />}>Gerenciar reparos</Button>,
          <Button key="parks" component={Link} to="/pracas" variant="contained" startIcon={<ParkOutlined />}>Encontrar praça</Button>,
        ]}
      />

      <ProfileCompletionPrompt />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Praças disponíveis" value={dashboard.pracasDisponiveis} helper="Oportunidades para adoção" icon={ParkOutlined} color="success" onClick={() => navigate('/pracas')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Minhas propostas" value={dashboard.totalPropostas} helper={`${dashboard.propostasEmAnalise} aguardando análise`} icon={AssignmentOutlined} color="warning" onClick={() => navigate('/minhas-propostas')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Praças adotadas" value={dashboard.pracasAdotadas} helper={`${formatNumber(dashboard.areaTotalAdotadaM2 || 0, 0)} m² cuidados`} icon={HandshakeOutlined} color="primary" onClick={() => navigate('/minhas-propostas')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Reparos ativos" value={dashboard.reparosAtivos} helper={`${dashboard.reparosAguardandoConfirmacao} aguardando confirmação`} icon={BuildOutlined} color="error" onClick={() => navigate('/reparos')} />
        </Grid>
      </Grid>

      {hasAttention && (
        <Alert severity="warning" icon={<TrendingUpOutlined />}>
          <strong>Atenção:</strong> {dashboard.propostasEmAnalise > 0 && `${dashboard.propostasEmAnalise} proposta(s) aguardando análise. `}
          {dashboard.adocoesProximasDoFim > 0 && `${dashboard.adocoesProximasDoFim} adoção(ões) termina(m) nos próximos 30 dias.`}
          {dashboard.reparosAguardandoConfirmacao > 0 && ` ${dashboard.reparosAguardandoConfirmacao} reparo(s) aguardando confirmação.`}
          {dashboard.reparosContestados > 0 && ` ${dashboard.reparosContestados} reparo(s) contestado(s).`}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
            <SectionHeader title="Oportunidades de adoção" actionLabel="Ver todas" to="/pracas" />
            {dashboard.pracasRecomendadas.length === 0 ? (
              <EmptyState title="Nenhuma praça disponível agora" description="Novas oportunidades aparecerão aqui assim que forem cadastradas." />
            ) : (
              <Grid container spacing={2}>
                {dashboard.pracasRecomendadas.map((praca) => (
                  <Grid key={praca.id} size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {praca.fotoUrl && <CardMedia component="img" height="120" image={resolveApiUrl(praca.fotoUrl)} alt={praca.nome} />}
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700}>{praca.nome}</Typography>
                        <Typography variant="body2" color="text.secondary">{[praca.bairro, praca.cidade].filter(Boolean).join(' • ')}</Typography>
                        <Typography variant="caption" color="text.secondary">{praca.metragemM2 ? `${formatNumber(praca.metragemM2, 0)} m²` : 'Área não informada'}</Typography>
                      </CardContent>
                      <CardActions><Button component={Link} to={`/pracas/${praca.id}`} size="small">Conhecer praça</Button></CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Impacto comunitário</Typography>
            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" justifyContent="space-between"><Typography variant="body2">Taxa de aprovação</Typography><Typography fontWeight={700}>{dashboard.taxaAprovacao}%</Typography></Stack>
                <LinearProgress variant="determinate" value={Math.min(dashboard.taxaAprovacao, 100)} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
              </Box>
              <Divider />
              {[
                [SquareFootOutlined, 'Área total adotada', `${formatNumber(dashboard.areaTotalAdotadaM2 || 0, 0)} m²`],
                [BuildOutlined, 'Total de reparos assumidos', dashboard.totalReparos],
                [PendingActionsOutlined, 'Reparos aceitos', dashboard.reparosAceitos],
                [BuildOutlined, 'Reparos em andamento', dashboard.reparosEmAndamento],
                [PendingActionsOutlined, 'Aguardando confirmação', dashboard.reparosAguardandoConfirmacao],
                [CheckCircleOutline, 'Reparos confirmados', dashboard.reparosConfirmados],
                [ReportProblemOutlined, 'Reparos contestados', dashboard.reparosContestados],
              ].map(([Icon, label, value]) => (
                <Stack key={label} direction="row" alignItems="center" spacing={1.5}>
                  <Icon color="primary" />
                  <Box sx={{ flex: 1 }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography fontWeight={700}>{value}</Typography></Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <SectionHeader title="Propostas recentes" actionLabel="Acompanhar propostas" to="/minhas-propostas" />
            {dashboard.propostasRecentes.length === 0 ? (
              <Typography color="text.secondary">Sua empresa ainda não enviou propostas.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Praça</TableCell><TableCell>Envio</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                  <TableBody>
                    {dashboard.propostasRecentes.map((proposta) => (
                      <TableRow hover key={proposta.id} onClick={() => navigate(`/pracas/${proposta.pracaId}`)} sx={{ cursor: 'pointer' }}>
                        <TableCell><Typography variant="body2" fontWeight={700}>{proposta.nomePraca}</Typography><Typography variant="caption" color="text.secondary">{proposta.cidadePraca}</Typography></TableCell>
                        <TableCell>{formatDate(proposta.dataRegistro)}</TableCell>
                        <TableCell><StatusChip status={proposta.status} config={getPropostaStatusConfig(proposta.status)} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <SectionHeader title="Reparos recentes" actionLabel="Gerenciar reparos" to="/reparos" />
            {dashboard.reparosRecentes.length === 0 ? (
              <Typography color="text.secondary">Sua empresa ainda não assumiu reparos comunitários.</Typography>
            ) : (
              <List disablePadding>
                {dashboard.reparosRecentes.map((reparo, index) => (
                  <React.Fragment key={reparo.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      disableGutters
                      component={Link}
                      to={`/denuncias?issueId=${reparo.denunciaId}`}
                      secondaryAction={<StatusChip status={reparo.status} config={REPAIR_STATUS[reparo.status]} />}
                      sx={{ color: 'inherit', textDecoration: 'none', pr: 14 }}
                    >
                      <ListItemText primary={reparo.denunciaTitulo} secondary={`Assumido em ${formatDateTime(reparo.dataAceite)}`} primaryTypographyProps={{ fontWeight: 700, variant: 'body2' }} />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default EmpresaDashboard;
