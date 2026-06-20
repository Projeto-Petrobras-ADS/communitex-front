// /src/components/CommunityMap/IssueFormModal.js
import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IssueService from '../../services/IssueService';

// Constantes centralizadas
import { ISSUE_TYPES_ARRAY } from '../../constants';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
  Grid,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
} from '@mui/icons-material';

/**
 * Schema de validação do formulário
 */
const validationSchema = Yup.object({
  titulo: Yup.string()
    .required('Título é obrigatório')
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(150, 'Título deve ter no máximo 150 caracteres'),
  descricao: Yup.string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
  tipo: Yup.string()
    .required('Selecione o tipo do problema')
    .oneOf(ISSUE_TYPES_ARRAY.map(t => t.value), 'Tipo inválido')
});

/**
 * Modal de formulário para cadastro de nova denúncia
 */
const IssueFormModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  latitude, 
  longitude 
}) => {
  const theme = useTheme();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      titulo: '',
      descricao: '',
      tipo: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const issueData = {
          titulo: values.titulo,
          descricao: values.descricao,
          tipo: values.tipo,
          latitude,
          longitude
        };

        await IssueService.create(issueData, photoFile);
        
        formik.resetForm();
        setPhotoPreview(null);
        setPhotoFile(null);
        
        if (onSuccess) {
          onSuccess();
        }
        
        onClose();
      } catch (err) {
        console.error('Erro ao criar denúncia:', err);
        
        if (err.response?.status === 409) {
          setSubmitError('Já existe uma denúncia similar nesta região. Considere apoiar a existente!');
        } else if (err.response?.status === 401) {
          setSubmitError('Você precisa estar logado para fazer uma denúncia.');
        } else if (err.response?.status === 400) {
          setSubmitError('Dados inválidos. Verifique os campos e tente novamente.');
        } else {
          setSubmitError('Não foi possível enviar a denúncia. Tente novamente mais tarde.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setPhotoFile(file);
    setSubmitError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    formik.resetForm();
    setPhotoPreview(null);
    setPhotoFile(null);
    setSubmitError(null);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon />
          <Typography variant="h6" fontWeight={600}>
            Nova Denúncia
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {/* Localização */}
          <Chip
            icon={<LocationIcon />}
            label={`Lat: ${latitude?.toFixed(6)} | Lng: ${longitude?.toFixed(6)}`}
            variant="outlined"
            color="primary"
            sx={{ mb: 3 }}
          />

          {/* Tipo do Problema */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Tipo do Problema *
          </Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {ISSUE_TYPES_ARRAY.map((type) => (
              <Grid size={{ xs: 6, sm: 4 }} key={type.value}>
                <Paper
                  elevation={formik.values.tipo === type.value ? 4 : 0}
                  onClick={() => formik.setFieldValue('tipo', type.value)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: '2px solid',
                    borderColor: formik.values.tipo === type.value 
                      ? type.color 
                      : 'divider',
                    bgcolor: formik.values.tipo === type.value 
                      ? alpha(type.color, 0.1) 
                      : 'transparent',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: type.color,
                      bgcolor: alpha(type.color, 0.05),
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>
                    {type.icon}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {type.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {formik.touched.tipo && formik.errors.tipo && (
            <Typography color="error" variant="caption" sx={{ mb: 2, display: 'block' }}>
              {formik.errors.tipo}
            </Typography>
          )}

          {/* Título */}
          <TextField
            fullWidth
            label="Título"
            name="titulo"
            placeholder="Ex: Buraco grande na Rua das Flores"
            value={formik.values.titulo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.titulo && Boolean(formik.errors.titulo)}
            helperText={formik.touched.titulo && formik.errors.titulo}
            required
            sx={{ mb: 3 }}
          />

          {/* Descrição */}
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            placeholder="Descreva o problema em detalhes. Quanto mais informações, melhor!"
            multiline
            rows={4}
            value={formik.values.descricao}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.descricao && Boolean(formik.errors.descricao)}
            helperText={
              (formik.touched.descricao && formik.errors.descricao) ||
              `${formik.values.descricao.length}/2000`
            }
            required
            sx={{ mb: 3 }}
          />

          {/* Upload de Foto */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Foto (opcional)
          </Typography>
          
          {photoPreview ? (
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <img
                src={photoPreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'cover',
                }}
              />
              <IconButton
                onClick={removePhoto}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: alpha(theme.palette.error.main, 0.9),
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.error.dark,
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : (
            <Paper
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                borderStyle: 'dashed',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.grey[500], 0.05),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Clique para adicionar uma foto
              </Typography>
              <Typography variant="caption" color="text.disabled">
                JPG, PNG ou GIF (máx. 5MB)
              </Typography>
            </Paper>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />

          {/* Erro de submit */}
          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !formik.isValid}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IssueFormModal;
