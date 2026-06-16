import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  AdminPanelSettings as AdminIcon,
  Cancel as RejectIcon,
  CheckCircle as ApproveIcon,
  FactCheck as ReviewIcon,
} from '@mui/icons-material';
import { getPropostaStatusConfig, PROPOSTA_STATUS } from '../../constants/statusConfig';
import { EmptyState, LoadingState, PageHeader, StatusChip } from '../common';
import { useNotification } from '../../context/NotificationContext';

const proposalDate = (proposta) => proposta.dataRegistro || proposta.dataInicio;
const companyName = (proposta) => proposta.empresaNomeFantasia || proposta.empresaNome || `Empresa (ID ${proposta.empresaId})`;
const squareName = (proposta) => proposta.pracaNome || proposta.nomePraca || `Praça (ID ${proposta.pracaId})`;

const GerenciamentoPropostas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { notifyError, notifySuccess } = useNotification();
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, propostaId: null, novoStatus: '' });

  const fetchPropostas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/propostas');
      setPropostas([...(response.data || [])].sort((a, b) => new Date(proposalDate(b)) - new Date(proposalDate(a))));
      setError('');
    } catch (err) {
      setError(err.message || 'Erro ao carregar o painel de propostas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPropostas(); }, [fetchPropostas]);

  const filtered = useMemo(
    () => statusFilter ? propostas.filter((proposta) => proposta.status === statusFilter) : propostas,
    [propostas, statusFilter]
  );

  const closeDialog = () => setConfirmDialog({ open: false, propostaId: null, novoStatus: '' });

  const updateStatus = async () => {
    const { propostaId, novoStatus } = confirmDialog;
    try {
      await api.put(`/api/propostas/${propostaId}/status`, { status: novoStatus });
      setPropostas((current) => current.map((proposta) => proposta.id === propostaId ? { ...proposta, status: novoStatus } : proposta));
      notifySuccess(`Proposta ${novoStatus === 'APROVADA' ? 'aprovada' : 'rejeitada'} com sucesso.`);
    } catch (err) {
      notifyError(err.message || 'Não foi possível atualizar a proposta.');
    } finally {
      closeDialog();
    }
  };

  const actions = (proposta) => {
    const canReview = proposta.status === 'PROPOSTA' || proposta.status === 'EM_ANALISE';
    if (!canReview) return <Typography variant="caption" color="text.secondary">Análise concluída</Typography>;
    return (
      <Stack direction="row" spacing={1}>
        <Button size="small" color="success" variant="contained" startIcon={<ApproveIcon />} onClick={() => setConfirmDialog({ open: true, propostaId: proposta.id, novoStatus: 'APROVADA' })}>Aprovar</Button>
        <Button size="small" color="error" variant="outlined" startIcon={<RejectIcon />} onClick={() => setConfirmDialog({ open: true, propostaId: proposta.id, novoStatus: 'REJEITADA' })}>Rejeitar</Button>
      </Stack>
    );
  };

  if (loading) return <LoadingState message="Carregando propostas para análise..." />;
  if (error) return <Alert severity="error" action={<Button color="inherit" onClick={fetchPropostas}>Tentar novamente</Button>}>{error}</Alert>;

  return (
    <Box>
      <PageHeader
        title="Gestão de propostas"
        subtitle={`${propostas.length} proposta${propostas.length === 1 ? '' : 's'} registrada${propostas.length === 1 ? '' : 's'} na plataforma.`}
        icon={AdminIcon}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        {[
          ['Em análise', propostas.filter((p) => p.status === 'PROPOSTA' || p.status === 'EM_ANALISE').length, 'warning.main'],
          ['Aprovadas', propostas.filter((p) => p.status === 'APROVADA').length, 'success.main'],
          ['Rejeitadas', propostas.filter((p) => p.status === 'REJEITADA').length, 'error.main'],
        ].map(([label, value, color]) => (
          <Card key={label} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h4" fontWeight={800} color={color}>{value}</Typography>
              <Typography color="text.secondary">{label}</Typography>
            </CardContent>
          </Card>
        ))}
        <FormControl sx={{ minWidth: 210, alignSelf: { sm: 'center' } }}>
          <InputLabel>Filtrar por status</InputLabel>
          <Select value={statusFilter} label="Filtrar por status" onChange={(event) => setStatusFilter(event.target.value)}>
            <MenuItem value="">Todos os status</MenuItem>
            {Object.values(PROPOSTA_STATUS).map((status) => <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {filtered.length === 0 ? (
        <EmptyState icon={ReviewIcon} title="Nenhuma proposta encontrada" description="Não há propostas correspondentes ao filtro selecionado." />
      ) : isMobile ? (
        <Stack spacing={2}>
          {filtered.map((proposta) => (
            <Card key={proposta.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={750}>{squareName(proposta)}</Typography>
                    <Typography variant="body2" color="text.secondary">{companyName(proposta)}</Typography>
                  </Box>
                  <StatusChip status={proposta.status} config={getPropostaStatusConfig(proposta.status)} />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', my: 2 }}>
                  Enviada em {proposalDate(proposta) ? new Date(proposalDate(proposta)).toLocaleDateString('pt-BR') : 'data não informada'}
                </Typography>
                {actions(proposta)}
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead><TableRow><TableCell>Praça</TableCell><TableCell>Empresa</TableCell><TableCell>Data</TableCell><TableCell>Status</TableCell><TableCell>Ações</TableCell></TableRow></TableHead>
            <TableBody>
              {filtered.map((proposta) => (
                <TableRow key={proposta.id} hover>
                  <TableCell><Typography fontWeight={700}>{squareName(proposta)}</Typography></TableCell>
                  <TableCell>{companyName(proposta)}</TableCell>
                  <TableCell>{proposalDate(proposta) ? new Date(proposalDate(proposta)).toLocaleDateString('pt-BR') : 'Não informada'}</TableCell>
                  <TableCell><StatusChip status={proposta.status} config={getPropostaStatusConfig(proposta.status)} /></TableCell>
                  <TableCell>{actions(proposta)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmDialog.open} onClose={closeDialog}>
        <DialogTitle>{confirmDialog.novoStatus === 'APROVADA' ? 'Aprovar proposta?' : 'Rejeitar proposta?'}</DialogTitle>
        <DialogContent><Typography>Esta ação atualizará imediatamente o status visível para a empresa proponente.</Typography></DialogContent>
        <DialogActions><Button onClick={closeDialog}>Cancelar</Button><Button onClick={updateStatus} variant="contained" color={confirmDialog.novoStatus === 'APROVADA' ? 'success' : 'error'}>Confirmar</Button></DialogActions>
      </Dialog>

    </Box>
  );
};

export default GerenciamentoPropostas;
