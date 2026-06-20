import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Park as ParkIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import AdocaoService from '../../services/AdocaoService';
import { getPropostaStatusConfig } from '../../constants/statusConfig';
import { CrudToolbar, EmptyState, LoadingState, PageHeader, StatusChip } from '../common';

const ProposalSummary = ({ proposta }) => {
  const statusConfig = getPropostaStatusConfig(proposta.status);

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={750}>
              {proposta.nomePraca || 'Praça não disponível'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enviada em {formatDate(proposta.dataRegistro)}
            </Typography>
          </Box>
          <StatusChip status={proposta.status} config={statusConfig} />
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ my: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {proposta.proposta}
        </Typography>
        <Button component={Link} to={`/pracas/${proposta.pracaId}`} startIcon={<VisibilityIcon />} fullWidth variant="outlined">
          Ver praça
        </Button>
      </CardContent>
    </Card>
  );
};

const formatDate = (date) => {
  if (!date) return 'Data não informada';
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? 'Data não informada' : parsed.toLocaleDateString('pt-BR');
};

const MinhasPropostas = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPropostas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await AdocaoService.listarMinhasPropostas();
      setPropostas([...data].sort((a, b) => String(b.dataRegistro || '').localeCompare(String(a.dataRegistro || ''))));
    } catch (err) {
      setError(err.message || 'Não foi possível carregar suas propostas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPropostas();
  }, [fetchPropostas]);

  const filteredPropostas = useMemo(
    () => statusFilter ? propostas.filter((proposta) => proposta.status === statusFilter) : propostas,
    [propostas, statusFilter]
  );

  if (loading) return <LoadingState message="Carregando suas propostas..." />;

  return (
    <Box>
      <PageHeader
        title="Minhas propostas"
        subtitle="Acompanhe o andamento das manifestações enviadas pela sua empresa."
        icon={DescriptionIcon}
      />

      {location.state?.successMessage && <Alert severity="success" sx={{ mb: 3 }}>{location.state.successMessage}</Alert>}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" onClick={fetchPropostas}>Tentar novamente</Button>}>
          {error}
        </Alert>
      )}

      {!error && propostas.length > 0 && (
        <CrudToolbar resultCount={filteredPropostas.length} hasActiveFilters={Boolean(statusFilter)} onClear={() => setStatusFilter('')}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}>
            <MenuItem value="">Todos os status</MenuItem>
            {['PROPOSTA', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'CONCLUIDA', 'FINALIZADA'].map((status) => (
              <MenuItem key={status} value={status}>{getPropostaStatusConfig(status).label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        </CrudToolbar>
      )}

      {!error && (propostas.length === 0 ? (
        <EmptyState
          icon={ParkIcon}
          title="Nenhuma proposta enviada"
          description="Explore os espaços disponíveis e encontre uma praça alinhada aos objetivos da sua empresa."
          actionComponent={<Button component={Link} to="/pracas" variant="contained">Explorar praças</Button>}
        />
      ) : filteredPropostas.length === 0 ? (
        <EmptyState title="Nenhuma proposta neste status" description="Altere o filtro para visualizar outras propostas." />
      ) : isMobile ? (
        <Stack spacing={2}>
          {filteredPropostas.map((proposta) => <ProposalSummary key={proposta.id} proposta={proposta} />)}
        </Stack>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Praça</TableCell>
                <TableCell>Data de envio</TableCell>
                <TableCell>Proposta</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPropostas.map((proposta) => (
                <TableRow key={proposta.id} hover>
                  <TableCell><Typography fontWeight={700}>{proposta.nomePraca || 'Praça não disponível'}</Typography></TableCell>
                  <TableCell>{formatDate(proposta.dataRegistro)}</TableCell>
                  <TableCell sx={{ maxWidth: 360 }}>
                    <Typography variant="body2" noWrap>{proposta.proposta}</Typography>
                  </TableCell>
                  <TableCell><StatusChip status={proposta.status} config={getPropostaStatusConfig(proposta.status)} /></TableCell>
                  <TableCell align="right">
                    <Button component={Link} to={`/pracas/${proposta.pracaId}`} startIcon={<VisibilityIcon />}>Ver praça</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
};

export default MinhasPropostas;
