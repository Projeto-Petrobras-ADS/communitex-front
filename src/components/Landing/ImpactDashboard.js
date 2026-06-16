import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  BuildOutlined,
  CheckCircleOutline,
  ParkOutlined,
  ScheduleOutlined,
  SquareFootOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import DashboardService from '../../services/DashboardService';
import { formatNumber } from '../../utils';

const WIDTH = 760;
const HEIGHT = 280;
const PADDING = 34;

const formatMonth = (month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' })
    .format(new Date(year, monthNumber - 1, 1))
    .replace('.', '');
};

const pointsFor = (data, field, maxValue) => data.map((item, index) => {
  const x = data.length === 1
    ? WIDTH / 2
    : PADDING + (index * (WIDTH - PADDING * 2)) / (data.length - 1);
  const y = HEIGHT - PADDING - ((item[field] || 0) * (HEIGHT - PADDING * 2)) / maxValue;
  return `${x},${y}`;
}).join(' ');

const ImpactChart = ({ data }) => {
  const theme = useTheme();
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.adocoesAcumuladas || 0, item.reparosConfirmadosAcumulados || 0])
  );
  const adoptionPoints = pointsFor(data, 'adocoesAcumuladas', maxValue);
  const repairPoints = pointsFor(data, 'reparosConfirmadosAcumulados', maxValue);
  const labels = data.length > 5
    ? data.filter((_, index) => index === 0 || index === data.length - 1 || index % Math.ceil(data.length / 4) === 0)
    : data;

  return (
    <Box>
      <Stack direction="row" spacing={2.5} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        {[
          ['Adoções bem-sucedidas', theme.palette.secondary.main],
          ['Reparos confirmados', theme.palette.primary.main],
        ].map(([label, color]) => (
          <Stack key={label} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 22, height: 3, borderRadius: 2, bgcolor: color }} />
            <Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Evolução mensal acumulada de adoções de praças e reparos confirmados"
          style={{ display: 'block', width: '100%', minWidth: 560 }}
        >
          {[0, 0.5, 1].map((ratio) => {
            const y = HEIGHT - PADDING - ratio * (HEIGHT - PADDING * 2);
            return <line key={ratio} x1={PADDING} y1={y} x2={WIDTH - PADDING} y2={y} stroke={theme.palette.divider} strokeDasharray="4 5" />;
          })}
          {adoptionPoints && <polyline points={adoptionPoints} fill="none" stroke={theme.palette.secondary.main} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
          {repairPoints && <polyline points={repairPoints} fill="none" stroke={theme.palette.primary.main} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
          {labels.map((item) => {
            const index = data.indexOf(item);
            const x = data.length === 1 ? WIDTH / 2 : PADDING + (index * (WIDTH - PADDING * 2)) / (data.length - 1);
            return <text key={item.mes} x={x} y={HEIGHT - 8} textAnchor="middle" fill={theme.palette.text.secondary} fontSize="12">{formatMonth(item.mes)}</text>;
          })}
        </svg>
      </Box>
    </Box>
  );
};

const LoadingImpact = () => (
  <Grid container spacing={2}>
    {[1, 2, 3, 4].map((item) => (
      <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item}>
        <Skeleton variant="rounded" height={132} />
      </Grid>
    ))}
    <Grid size={{ xs: 12 }}><Skeleton variant="rounded" height={340} /></Grid>
  </Grid>
);

const ImpactDashboard = () => {
  const theme = useTheme();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    DashboardService.obterDashboardPublico()
      .then(setDashboard)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => dashboard ? [
    { label: 'Praças adotadas', value: formatNumber(dashboard.pracasAdotadas, 0), helper: `de ${formatNumber(dashboard.totalPracas, 0)} praças`, icon: ParkOutlined, color: 'secondary' },
    { label: 'Área cuidada', value: `${formatNumber(dashboard.areaAdotadaM2, 0)} m²`, helper: 'sob adoção atualmente', icon: SquareFootOutlined, color: 'success' },
    { label: 'Reparos confirmados', value: formatNumber(dashboard.reparosConfirmados, 0), helper: 'validados pela comunidade', icon: CheckCircleOutline, color: 'primary' },
    { label: 'Tempo médio de reparo', value: `${formatNumber(dashboard.tempoMedioReparoHoras, 1)} h`, helper: 'do aceite à confirmação', icon: ScheduleOutlined, color: 'warning' },
  ] : [], [dashboard]);

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: alpha(theme.palette.primary.main, 0.035) }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 760, mb: 5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TrendingUpOutlined color="secondary" />
            <Typography variant="overline" color="secondary.main" fontWeight={850} letterSpacing={2}>IMPACTO EM MOVIMENTO</Typography>
          </Stack>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mt: 1 }}>
            Resultados reais de uma cidade mais bem cuidada.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.05rem', lineHeight: 1.7 }}>
            Indicadores agregados mostram como parcerias e participação comunitária transformam demandas em espaços adotados e reparos concluídos.
          </Typography>
        </Box>

        {loading && <LoadingImpact />}
        {!loading && error && (
          <Alert severity="info" variant="outlined">
            Os indicadores de impacto estão temporariamente indisponíveis. Você ainda pode conhecer e participar da plataforma normalmente.
          </Alert>
        )}
        {!loading && dashboard && (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {metrics.map(({ label, value, helper, icon: Icon, color }) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={label}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">{label}</Typography>
                          <Typography variant="h4" sx={{ mt: 0.75 }}>{value}</Typography>
                          <Typography variant="caption" color="text.secondary">{helper}</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: alpha(theme.palette[color].main, 0.12), color: `${color}.main` }}><Icon /></Avatar>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, height: '100%', bgcolor: 'background.paper' }}>
                  <Typography variant="h5" fontWeight={800}>Evolução do impacto</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Totais acumulados ao longo de todo o histórico da plataforma.</Typography>
                  {dashboard.evolucaoMensal.length > 0
                    ? <ImpactChart data={dashboard.evolucaoMensal} />
                    : <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>Os primeiros resultados aparecerão aqui.</Typography>}
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Paper variant="outlined" sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}><BuildOutlined /></Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>Eficiência coletiva</Typography>
                      <Typography variant="body2" color="text.secondary">Do compromisso ao resultado</Typography>
                    </Box>
                  </Stack>
                  {[
                    ['Praças atualmente adotadas', dashboard.taxaAdocao, 'secondary'],
                    ['Reparos confirmados pela comunidade', dashboard.taxaConfirmacaoReparos, 'primary'],
                  ].map(([label, value, color]) => (
                    <Box key={label} sx={{ mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2">{label}</Typography>
                        <Typography fontWeight={800}>{formatNumber(value, 1)}%</Typography>
                      </Stack>
                      <LinearProgress color={color} variant="determinate" value={Math.min(value, 100)} sx={{ mt: 1.25, height: 9, borderRadius: 6 }} />
                    </Box>
                  ))}
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    A confirmação comunitária encerra o ciclo do reparo e garante que o resultado foi percebido por quem vive o bairro.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default ImpactDashboard;
