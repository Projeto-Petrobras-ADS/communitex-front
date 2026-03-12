import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

// Constantes centralizadas
import { PRACA_STATUS_OPTIONS } from '../../constants';

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  MenuItem,
  useTheme,
  alpha,
  Snackbar,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Park as ParkIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  LocationCity as CityIcon,
  Map as MapIcon,
  SquareFoot as SquareFootIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const PracaSchema = Yup.object().shape({
  nome: Yup.string()
    .min(5, 'O nome deve ter pelo menos 5 caracteres')
    .required('O nome é obrigatório'),

  logradouro: Yup.string()
    .nullable(),
  bairro: Yup.string()
    .nullable(),
  cidade: Yup.string()
    .required('A cidade é obrigatória'),

  latitude: Yup.number()
    .typeError('Latitude deve ser um número (ex: -27.59)')
    .nullable(),
  longitude: Yup.number()
    .typeError('Longitude deve ser um número (ex: -48.54)')
    .nullable(),

  descricao: Yup.string()
    .max(1000, 'Descrição não pode exceder 1000 caracteres')
    .nullable(),

  fotoUrl: Yup.string()
    .url('Deve ser uma URL válida (ex: http://.../imagem.png)')
    .nullable(),

  metragemM2: Yup.number()
    .typeError('Metragem deve ser um número (ex: 2500.5)')
    .positive('Metragem deve ser um valor positivo')
    .nullable(),

  status: Yup.string()
    .oneOf(PRACA_STATUS_OPTIONS.map(opt => opt.value), 'Status inválido')
    .required('O status é obrigatório'),
});

const PracaForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError('');

    const pracaRequestDTO = {
      nome: values.nome,
      logradouro: values.logradouro || null,
      bairro: values.bairro || null,
      cidade: values.cidade,
      latitude: values.latitude ? parseFloat(values.latitude) : null,
      longitude: values.longitude ? parseFloat(values.longitude) : null,
      descricao: values.descricao || null,
      fotoUrl: values.fotoUrl || null,
      metragemM2: values.metragemM2 ? parseFloat(values.metragemM2) : null,
      status: values.status,
    };

    try {
      await api.post('/api/pracas', pracaRequestDTO);

      setSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate('/pracas');
      }, 2000);

    } catch (err) {
      console.error("Erro ao cadastrar praça:", err);
      setSubmitting(false);
      setServerError(err.response?.data?.message || 'Erro ao salvar a praça.');
    }
  };

  return (
    <Box sx={{ minHeight: '100%' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Button
          component={Link}
          to="/pracas"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: 'white', 
            mb: 2, 
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
          }}
        >
          Voltar para a lista
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ParkIcon />
          <Typography variant="h5" fontWeight={700}>
            Cadastrar Nova Praça
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          Preencha as informações do novo espaço público para a plataforma
        </Typography>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ borderRadius: 2 }}>
          <strong>Praça cadastrada com sucesso!</strong> Redirecionando para a lista...
        </Alert>
      </Snackbar>

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Formik
            initialValues={{
              nome: '',
              logradouro: '',
              bairro: '',
              cidade: '',
              latitude: '',
              longitude: '',
              descricao: '',
              fotoUrl: '',
              metragemM2: '',
              status: 'DISPONIVEL', 
            }}
            validationSchema={PracaSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                {serverError && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {serverError}
                  </Alert>
                )}

                {/* Informações Básicas */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ParkIcon color="primary" /> Informações Básicas
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      label="Nome da Praça"
                      name="nome"
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nome && Boolean(errors.nome)}
                      helperText={touched.nome && errors.nome}
                      placeholder="Ex: Praça Central do Parque"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ParkIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      select
                      label="Status da Praça"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                      required
                    >
                      {PRACA_STATUS_OPTIONS.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="URL da Foto Principal (Opcional)"
                      name="fotoUrl"
                      value={values.fotoUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fotoUrl && Boolean(errors.fotoUrl)}
                      helperText={touched.fotoUrl && errors.fotoUrl}
                      placeholder="http://exemplo.com/foto.jpg"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ImageIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Localização */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="primary" /> Localização
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Logradouro (Opcional)"
                      name="logradouro"
                      value={values.logradouro}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ex: Av. Principal, 100"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Bairro (Opcional)"
                      name="bairro"
                      value={values.bairro}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ex: Centro"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      name="cidade"
                      value={values.cidade}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cidade && Boolean(errors.cidade)}
                      helperText={touched.cidade && errors.cidade}
                      placeholder="Ex: São Paulo"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CityIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Latitude (Opcional)"
                      name="latitude"
                      type="number"
                      value={values.latitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.latitude && Boolean(errors.latitude)}
                      helperText={touched.latitude && errors.latitude}
                      placeholder="-27.5969"
                      inputProps={{ step: 'any' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Longitude (Opcional)"
                      name="longitude"
                      type="number"
                      value={values.longitude}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.longitude && Boolean(errors.longitude)}
                      helperText={touched.longitude && errors.longitude}
                      placeholder="-48.5495"
                      inputProps={{ step: 'any' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Características */}
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon color="primary" /> Características
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Metragem (m²) (Opcional)"
                      name="metragemM2"
                      type="number"
                      value={values.metragemM2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.metragemM2 && Boolean(errors.metragemM2)}
                      helperText={touched.metragemM2 && errors.metragemM2}
                      placeholder="Ex: 2500.50"
                      inputProps={{ step: '0.01' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SquareFootIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Descrição (Opcional)"
                      name="descricao"
                      multiline
                      rows={4}
                      value={values.descricao}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.descricao && Boolean(errors.descricao)}
                      helperText={touched.descricao && errors.descricao ? errors.descricao : `${(values.descricao || '').length}/1000 caracteres`}
                      placeholder="Descreva brevemente a praça, infraestrutura existente, equipamentos, etc."
                    />
                  </Grid>
                </Grid>

                {/* Submit Button */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    component={Link}
                    to="/pracas"
                    variant="outlined"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ 
                      px: 4,
                      boxShadow: '0 4px 12px rgba(45, 106, 79, 0.35)',
                    }}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Praça'}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default PracaForm;