import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  Handshake as HandshakeIcon,
  LightbulbOutlined as LightbulbIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import AdocaoService from '../../services/AdocaoService';
import PracaService from '../../services/PracaService';
import { PageHeader } from '../common';

const MAX_LENGTH = 2000;

const manifestacaoSchema = Yup.object({
  proposta: Yup.string()
    .min(20, 'Descreva sua proposta com pelo menos 20 caracteres.')
    .max(MAX_LENGTH, `A proposta não pode exceder ${MAX_LENGTH} caracteres.`)
    .required('A descrição da proposta é obrigatória.'),
});

const ManifestacaoInteresse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [pracaDisponivel, setPracaDisponivel] = useState(null);
  const pracaNome = location.state?.pracaNome || 'esta praça';

  useEffect(() => {
    PracaService.buscarPracaSimples(id)
      .then((praca) => setPracaDisponivel(praca.status === 'DISPONIVEL'))
      .catch(() => {
        setPracaDisponivel(false);
        setServerError('Não foi possível validar a disponibilidade desta praça.');
      });
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError('');
    try {
      await AdocaoService.registrarInteresse(id, values.proposta);
      navigate('/minhas-propostas', { state: { successMessage: 'Manifestação de interesse enviada com sucesso!' } });
    } catch (err) {
      setServerError(err.message || 'Não foi possível enviar sua manifestação.');
      setSubmitting(false);
    }
  };

  const tips = [
    'Explique quais melhorias serão realizadas.',
    'Apresente uma frequência realista de manutenção.',
    'Descreva a equipe ou parceiros envolvidos.',
    'Mostre como a comunidade será beneficiada.',
  ];

  return (
    <Box>
      <PageHeader
        title="Manifestar interesse"
        subtitle={`Conte como sua empresa pretende cuidar de ${pracaNome}.`}
        icon={HandshakeIcon}
        backLink={`/pracas/${id}`}
        backLabel="Voltar para a praça"
      />

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
        <Card sx={{ flex: 1, width: '100%' }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h5" fontWeight={800} gutterBottom>Plano inicial de adoção</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Esta manifestação será enviada ao poder público para avaliação. Seja objetivo e apresente compromissos possíveis de cumprir.
            </Typography>

            {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}
            {pracaDisponivel === false && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Esta praça não está disponível para receber novas propostas.
              </Alert>
            )}

            <Formik initialValues={{ proposta: '' }} validationSchema={manifestacaoSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, values, handleChange, handleBlur, errors, touched }) => {
                const progress = Math.min((values.proposta.length / MAX_LENGTH) * 100, 100);
                return (
                  <Form>
                    <TextField
                      fullWidth
                      multiline
                      minRows={10}
                      name="proposta"
                      label="Descrição da proposta"
                      placeholder="Ex.: Nossa empresa realizará jardinagem quinzenal, limpeza semanal e recuperação dos bancos..."
                      value={values.proposta}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.proposta && Boolean(errors.proposta)}
                      helperText={(touched.proposta && errors.proposta) || `${values.proposta.length} de ${MAX_LENGTH} caracteres`}
                      inputProps={{ maxLength: MAX_LENGTH }}
                    />
                    <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, borderRadius: 10, height: 5 }} />
                    <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                      <Button variant="outlined" onClick={() => navigate(`/pracas/${id}`)} disabled={isSubmitting}>Cancelar</Button>
                      <Button type="submit" variant="contained" disabled={isSubmitting || pracaDisponivel !== true} startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}>
                        {isSubmitting ? 'Enviando...' : 'Enviar manifestação'}
                      </Button>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </CardContent>
        </Card>

        <Card sx={{ width: { xs: '100%', lg: 340 }, position: { lg: 'sticky' }, top: { lg: 92 } }}>
          <CardContent>
            <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightbulbIcon color="secondary" /> Uma boa proposta inclui
            </Typography>
            <List dense>
              {tips.map((tip) => (
                <ListItem key={tip} disableGutters>
                  <ListItemIcon sx={{ minWidth: 34 }}><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ManifestacaoInteresse;
