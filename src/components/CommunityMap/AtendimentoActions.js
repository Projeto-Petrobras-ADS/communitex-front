import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, Stack, TextField, Typography,
} from '@mui/material';
import { BuildOutlined, CheckCircleOutline, PlayArrowOutlined, ReportProblemOutlined, PhotoCameraOutlined, DeleteOutline } from '@mui/icons-material';
import IssueService from '../../services/IssueService';
import { resolveApiUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const AtendimentoActions = ({ issue, onChanged }) => {
  const { user } = useAuth();
  const { notifyError, notifySuccess } = useNotification();
  const [atendimento, setAtendimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [text, setText] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [fotoError, setFotoError] = useState('');
  const roles = user?.roles || [];
  const isEmpresa = roles.includes('ROLE_EMPRESA');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await IssueService.findAtendimento(issue.id);
      setAtendimento(response.data);
    } catch (err) {
      if (err.status === 404 || err.response?.status === 404) setAtendimento(null);
      else notifyError(err.message || 'Não foi possível carregar os dados do reparo.');
    } finally {
      setLoading(false);
    }
  }, [issue.id, notifyError]);

  useEffect(() => { load(); }, [load]);

  const run = async (action, successMessage) => {
    setSubmitting(true);
    try {
      await action();
      notifySuccess(successMessage);
      setDialog(null);
      setText('');
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
      setFoto(null);
      setFotoPreview('');
      setFotoError('');
      await load();
      onChanged?.();
    } catch (err) {
      notifyError(err.message || 'Não foi possível atualizar o reparo.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitDialog = () => {
    if (dialog === 'assumir') return run(() => IssueService.assumirAtendimento(issue.id, text), 'Reparo assumido pela sua empresa.');
    if (dialog === 'concluir') return run(() => IssueService.concluirAtendimento(issue.id, text, foto), 'Conclusão enviada para confirmação do autor.');
    if (dialog === 'contestar') return run(() => IssueService.contestarAtendimento(issue.id, text), 'Reparo contestado e encaminhado para revisão.');
  };

  if (loading) return <CircularProgress size={20} />;

  return (
    <Box sx={{ mt: 2 }}>
      {atendimento && (
        <Alert severity={atendimento.status === 'CONTESTADO' ? 'error' : atendimento.status === 'CONFIRMADO_PELO_AUTOR' ? 'success' : 'info'} sx={{ mb: 1.5 }}>
          <Typography variant="body2" fontWeight={700}>{atendimento.empresaNome}</Typography>
          <Typography variant="body2">{atendimento.descricaoReparo || atendimento.descricaoPlanejada}</Typography>
          {atendimento.fotoDepoisUrl && <Button href={resolveApiUrl(atendimento.fotoDepoisUrl)} target="_blank" size="small">Ver evidência</Button>}
          {atendimento.motivoContestacao && <Typography variant="caption" display="block">Contestação: {atendimento.motivoContestacao}</Typography>}
        </Alert>
      )}

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {isEmpresa && !atendimento && ['ABERTA', 'EM_ANALISE'].includes(issue.status) && (
          <Button variant="contained" startIcon={<BuildOutlined />} onClick={() => setDialog('assumir')}>Assumir reparo</Button>
        )}
        {atendimento?.podeGerenciar && atendimento.status === 'ACEITO' && (
          <Button variant="contained" startIcon={<PlayArrowOutlined />} disabled={submitting} onClick={() => run(() => IssueService.iniciarAtendimento(issue.id), 'Reparo iniciado.')}>Iniciar reparo</Button>
        )}
        {atendimento?.podeGerenciar && atendimento.status === 'EM_ANDAMENTO' && (
          <Button variant="contained" startIcon={<CheckCircleOutline />} onClick={() => setDialog('concluir')}>Informar conclusão</Button>
        )}
        {atendimento?.podeConfirmar && atendimento.status === 'CONCLUIDO_PELA_EMPRESA' && (
          <>
            <Button color="success" variant="contained" startIcon={<CheckCircleOutline />} disabled={submitting} onClick={() => run(() => IssueService.confirmarAtendimento(issue.id), 'Reparo confirmado. Denúncia resolvida!')}>Confirmar reparo</Button>
            <Button color="error" variant="outlined" startIcon={<ReportProblemOutlined />} onClick={() => setDialog('contestar')}>Contestar</Button>
          </>
        )}
      </Stack>

      <Dialog open={Boolean(dialog)} onClose={() => !submitting && setDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>{dialog === 'assumir' ? 'Assumir reparo' : dialog === 'concluir' ? 'Informar conclusão' : 'Contestar reparo'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth multiline rows={4} sx={{ mt: 1 }}
            label={dialog === 'assumir' ? 'Como a empresa pretende realizar o reparo?' : dialog === 'concluir' ? 'Descreva o serviço realizado' : 'Por que o reparo não pode ser confirmado?'}
            value={text} onChange={(event) => setText(event.target.value)}
            helperText="Mínimo de 10 caracteres"
          />
          {dialog === 'concluir' && (
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {fotoPreview && <Box component="img" src={fotoPreview} alt="Pré-visualização da evidência" sx={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 2 }} />}
              <Stack direction="row" spacing={1}>
                <Button component="label" variant="outlined" startIcon={<PhotoCameraOutlined />}>
                  {foto ? 'Trocar evidência' : 'Anexar evidência'}
                  <input hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
                    const arquivo = event.target.files?.[0];
                    event.target.value = '';
                    if (!arquivo) return;
                    if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
                      setFotoError('Envie uma imagem JPEG, PNG ou WebP.');
                      return;
                    }
                    if (arquivo.size > 5 * 1024 * 1024) {
                      setFotoError('A imagem deve ter no máximo 5 MB.');
                      return;
                    }
                    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
                    setFoto(arquivo);
                    setFotoPreview(URL.createObjectURL(arquivo));
                    setFotoError('');
                  }} />
                </Button>
                {foto && <Button color="error" startIcon={<DeleteOutline />} onClick={() => {
                  if (fotoPreview) URL.revokeObjectURL(fotoPreview);
                  setFoto(null);
                  setFotoPreview('');
                  setFotoError('');
                }}>Remover</Button>}
              </Stack>
              {fotoError && <Alert severity="error">{fotoError}</Alert>}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)} disabled={submitting}>Cancelar</Button>
          <Button variant="contained" onClick={submitDialog} disabled={submitting || text.trim().length < 10}>{submitting ? 'Enviando...' : 'Confirmar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AtendimentoActions;
