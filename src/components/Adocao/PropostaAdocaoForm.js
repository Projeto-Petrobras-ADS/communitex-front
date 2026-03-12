import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Send as SendIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';

const PropostaSchema = Yup.object().shape({
  descricaoProjeto: Yup.string()
    .max(1000, 'A descrição não pode exceder 1000 caracteres.')
    .min(20, 'A descrição deve ter pelo menos 20 caracteres.')
    .required('A descrição do projeto é obrigatória.'),
  dataInicio: Yup.date()
    .required('A data de início é obrigatória.')
    .typeError('A data de início deve ser válida.'),
  dataFim: Yup.date()
    .nullable()
    .typeError('A data de término deve ser válida.')
    .min(
      Yup.ref('dataInicio'),
      'A data de término deve ser após a data de início.'
    ),
});

const PropostaAdocaoForm = () => {
  const theme = useTheme();
  const { id: pracaId } = useParams(); 
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(''); 

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError('');
   
    const adocaoRequestDTO = {
      pracaId: parseInt(pracaId, 10),
      descricaoProjeto: values.descricaoProjeto,
      dataInicio: values.dataInicio,
      dataFim: values.dataFim || null,
      status: 'PROPOSTA',
    };

    try {
      await api.post('/api/adocoes', adocaoRequestDTO);
      
      setSubmitting(false);
      navigate(`/pracas/${pracaId}`);
      
    } catch (err) {
      console.error("Erro ao enviar proposta:", err);
      setSubmitting(false);
      if (err.response && err.response.data) {
        setServerError(err.response.data.message || 'Ocorreu um erro desconhecido.');
      } else {
        setServerError('Não foi possível conectar ao servidor.');
      }
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: { xs: 3, md: 4 },
          px: 3,
          borderRadius: 3,
          mx: 3,
          mt: 3,
        }}
      >
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Button
            component={Link}
            to={`/pracas/${pracaId}`}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: 'white',
              mb: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Cancelar e Voltar
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HandshakeIcon sx={{ fontSize: 36 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Proposta de Adoção
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Preencha os detalhes do seu projeto para a praça
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Formulário */}
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, py: 4 }}>
        <Formik
          initialValues={{
            descricaoProjeto: '',
            dataInicio: '',
            dataFim: '',
          }}
          validationSchema={PropostaSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              {serverError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {serverError}
                </Alert>
              )}

              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  {/* Descrição do Projeto */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon color="primary" /> Descrição do Projeto
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      name="descricaoProjeto"
                      label="Detalhe o que sua empresa planeja fazer *"
                      placeholder="Descreva o que sua empresa planeja fazer na praça (ex: manutenção, novos equipamentos, paisagismo...)"
                      value={values.descricaoProjeto}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.descricaoProjeto && Boolean(errors.descricaoProjeto)}
                      helperText={
                        touched.descricaoProjeto && errors.descricaoProjeto
                          ? errors.descricaoProjeto
                          : `${(values.descricaoProjeto || '').length}/1000 caracteres`
                      }
                      inputProps={{ maxLength: 1000 }}
                      sx={inputSx}
                    />
                  </Paper>

                  {/* Datas */}
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon color="primary" /> Período do Projeto
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        type="date"
                        name="dataInicio"
                        label="Data de Início *"
                        value={values.dataInicio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.dataInicio && Boolean(errors.dataInicio)}
                        helperText={touched.dataInicio && errors.dataInicio}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />

                      <TextField
                        fullWidth
                        type="date"
                        name="dataFim"
                        label="Data de Término (opcional)"
                        value={values.dataFim}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.dataFim && Boolean(errors.dataFim)}
                        helperText={touched.dataFim && errors.dataFim}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    </Stack>
                  </Paper>
                </CardContent>
              </Card>

              {/* Botão Submit */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  py: 1.8,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 8px 20px rgba(45, 106, 79, 0.35)',
                  '&:hover': {
                    boxShadow: '0 12px 30px rgba(45, 106, 79, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isSubmitting ? 'Enviando Proposta...' : 'Enviar Proposta'}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default PropostaAdocaoForm;