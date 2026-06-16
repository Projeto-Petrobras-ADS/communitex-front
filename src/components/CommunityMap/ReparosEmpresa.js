import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert, Button, Card, CardActions, CardContent, Chip, Grid, Paper, Stack, Tab, Tabs, Typography,
} from '@mui/material';
import { BuildOutlined, MapOutlined, RefreshOutlined } from '@mui/icons-material';
import IssueService from '../../services/IssueService';
import { getIssueStatusConfig } from '../../constants';
import { formatDateTime } from '../../utils';
import { EmptyState, LoadingState, PageHeader, StatusChip } from '../common';

const REPAIR_STATUS = {
  ACEITO: ['Aceito', 'info'],
  EM_ANDAMENTO: ['Em andamento', 'primary'],
  CONCLUIDO_PELA_EMPRESA: ['Aguardando confirmação', 'warning'],
  CONFIRMADO_PELO_AUTOR: ['Confirmado', 'success'],
  CONTESTADO: ['Contestado', 'error'],
  CANCELADO: ['Cancelado', 'default'],
};

const ReparosEmpresa = () => {
  const [tab, setTab] = useState(0);
  const [disponiveis, setDisponiveis] = useState([]);
  const [meus, setMeus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [availableResponse, mineResponse] = await Promise.all([
        IssueService.listarReparosDisponiveis(),
        IssueService.listarMeusAtendimentos(),
      ]);
      setDisponiveis(availableResponse.data || []);
      setMeus(mineResponse.data || []);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os reparos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingState message="Carregando oportunidades de reparo..." />;

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Reparos comunitários"
        subtitle="Assuma demandas, acompanhe a execução e aguarde a validação de quem reportou."
        icon={BuildOutlined}
        actions={<Button startIcon={<RefreshOutlined />} onClick={load}>Atualizar</Button>}
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Paper variant="outlined">
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab label={`Disponíveis (${disponiveis.length})`} />
          <Tab label={`Meus reparos (${meus.length})`} />
        </Tabs>
      </Paper>

      {tab === 0 && (disponiveis.length === 0 ? (
        <EmptyState icon={BuildOutlined} title="Nenhum reparo disponível" description="As novas demandas abertas aparecerão aqui." />
      ) : (
        <Grid container spacing={2}>
          {disponiveis.map((issue) => (
            <Grid key={issue.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography variant="h6">{issue.titulo}</Typography>
                    <StatusChip status={issue.status} config={getIssueStatusConfig(issue.status)} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{issue.descricao}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>{issue.totalApoios || 0} apoio(s)</Typography>
                </CardContent>
                <CardActions><Button component={Link} to={`/denuncias?lat=${issue.latitude}&lng=${issue.longitude}&issueId=${issue.id}`} startIcon={<MapOutlined />}>Abrir e assumir</Button></CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ))}

      {tab === 1 && (meus.length === 0 ? (
        <EmptyState icon={BuildOutlined} title="Nenhum reparo assumido" description="Explore as demandas disponíveis para começar." />
      ) : (
        <Grid container spacing={2}>
          {meus.map((repair) => {
            const [label, color] = REPAIR_STATUS[repair.status] || [repair.status, 'default'];
            return (
              <Grid key={repair.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="h6">{repair.denunciaTitulo}</Typography>
                      <Chip label={label} color={color} size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{repair.descricaoReparo || repair.descricaoPlanejada}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>Assumido em {formatDateTime(repair.dataAceite)}</Typography>
                    {repair.motivoContestacao && <Alert severity="error" sx={{ mt: 2 }}>{repair.motivoContestacao}</Alert>}
                  </CardContent>
                  <CardActions><Button component={Link} to={`/denuncias?issueId=${repair.denunciaId}`} startIcon={<MapOutlined />}>Gerenciar no mapa</Button></CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ))}
    </Stack>
  );
};

export default ReparosEmpresa;
