import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Avatar,
  Chip,
  InputAdornment,
  IconButton,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Park as ParkIcon,
  Public as PublicIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  EmojiEvents as TrophyIcon,
  Favorite as FavoriteIcon,
  Handshake as HandshakeIcon,
  Nature as NatureIcon,
} from '@mui/icons-material';

// Esquema de Validação (Yup)
const RegisterSchema = Yup.object().shape({
  // Dados da Empresa
  razaoSocial: Yup.string()
    .required('A Razão Social é obrigatória'),
  cnpj: Yup.string()
    .matches(/^[0-9]{14}$/, 'CNPJ deve conter 14 números (sem pontos ou traços)')
    .required('CNPJ é obrigatório'),
  nomeFantasia: Yup.string()
    .nullable(),
  email: Yup.string()
    .email('Email da empresa inválido')
    .required('Email da empresa é obrigatório'),
  telefone: Yup.string()
    .nullable(),

  // Dados do Representante
  nomeRepresentante: Yup.string()
    .required('Nome do representante é obrigatório'),
  emailRepresentante: Yup.string()
    .email('Email do representante inválido')
    .required('Email do representante é obrigatório'),

  // Dados de Acesso
  senhaRepresentante: Yup.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .required('Senha é obrigatória'),
  confirmSenha: Yup.string()
    .oneOf([Yup.ref('senhaRepresentante'), null], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
});

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError('');
    
    const newRegisterDTO = {
      razaoSocial: values.razaoSocial,
      cnpj: values.cnpj,
      nomeFantasia: values.nomeFantasia || null,
      email: values.email,
      telefone: values.telefone || null,
      nomeRepresentante: values.nomeRepresentante,
      emailRepresentante: values.emailRepresentante,
      senhaRepresentante: values.senhaRepresentante,
    };

    try {
      await api.post('/api/empresas', newRegisterDTO);
      
      setSubmitting(false);
      alert('Cadastro realizado com sucesso! Use o EMAIL DO REPRESENTANTE para fazer o login.');
      navigate('/login'); 

    } catch (err) {
      console.error("Erro no cadastro:", err);
      setSubmitting(false);
      if (err.response && err.response.data) {
        setServerError(err.response.data.message || 'Erro ao realizar o cadastro. Verifique os dados.');
      } else {
        setServerError('Não foi possível conectar ao servidor.');
      }
    }
  };

  const benefits = [
    { icon: <NatureIcon />, text: 'Cumpra responsabilidade ambiental' },
    { icon: <HandshakeIcon />, text: 'Fortaleça relação com a comunidade' },
    { icon: <TrophyIcon />, text: 'Destaque como empresa sustentável' },
    { icon: <FavoriteIcon />, text: 'Transforme espaços públicos' },
  ];

  const stats = [
    { value: '150+', label: 'Praças' },
    { value: '80+', label: 'Empresas' },
    { value: '98%', label: 'Satisfação' },
  ];

  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Painel Lateral */}
      <Box
        sx={{
          flex: { lg: '0 0 40%' },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          p: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5,
          },
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <ParkIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Communitex
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Gestão de Adoção de Praças
              </Typography>
            </Box>
          </Box>

          <Chip 
            label="Cadastro Empresarial" 
            icon={<BusinessIcon />}
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(255,255,255,0.15)', 
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              '& .MuiChip-icon': { color: 'white' }
            }} 
          />

          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Por que sua empresa?
          </Typography>
          <Stack spacing={2} sx={{ mb: 4 }}>
            {benefits.map((benefit, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                    transform: 'translateX(8px)',
                  }
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                  {benefit.icon}
                </Avatar>
                <Typography variant="body2" fontWeight={500}>{benefit.text}</Typography>
              </Box>
            ))}
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 3,
            }}
          >
            <Stack direction="row" justifyContent="space-around">
              {stats.map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Stack spacing={1.5}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Já tem uma conta?
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Fazer Login
            </Button>
            <Button
              component={Link}
              to="/register/pessoa-fisica"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Cadastro de Pessoa Física
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Formulário */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          py: { xs: 4, md: 5 },
          bgcolor: 'background.default',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: 'text.secondary',
          }}
        >
          Voltar
        </Button>

        <Card 
          elevation={0}
          sx={{ 
            maxWidth: 600, 
            width: '100%', 
            mt: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                <BusinessIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Registrar Empresa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os dados para cadastrar sua empresa na plataforma
              </Typography>
            </Box>

            {serverError && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {serverError}
              </Alert>
            )}

            <Formik
              initialValues={{
                razaoSocial: '',
                cnpj: '',
                nomeFantasia: '',
                email: '',
                telefone: '',
                nomeRepresentante: '',
                emailRepresentante: '',
                senhaRepresentante: '',
                confirmSenha: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  {/* Dados da Empresa */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="primary" /> Dados da Empresa
                    </Typography>

                    <TextField
                      fullWidth
                      label="Razão Social"
                      name="razaoSocial"
                      value={values.razaoSocial}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.razaoSocial && Boolean(errors.razaoSocial)}
                      helperText={touched.razaoSocial && errors.razaoSocial}
                      placeholder="Minha Empresa LTDA"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ...inputSx, mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Nome Fantasia (Opcional)"
                      name="nomeFantasia"
                      value={values.nomeFantasia}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Nome Fantasia"
                      sx={{ ...inputSx, mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="CNPJ (somente números)"
                      name="cnpj"
                      value={values.cnpj}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.cnpj && Boolean(errors.cnpj)}
                      helperText={touched.cnpj && errors.cnpj}
                      placeholder="12345678000199"
                      inputProps={{ maxLength: 14 }}
                      sx={{ ...inputSx, mb: 2 }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Email da Empresa"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        placeholder="contato@empresa.com"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />

                      <TextField
                        fullWidth
                        label="Telefone (Opcional)"
                        name="telefone"
                        value={values.telefone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="4733333333"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    </Stack>
                  </Paper>

                  {/* Dados do Representante */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BadgeIcon color="primary" /> Dados do Representante Legal
                    </Typography>

                    <TextField
                      fullWidth
                      label="Nome Completo"
                      name="nomeRepresentante"
                      value={values.nomeRepresentante}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nomeRepresentante && Boolean(errors.nomeRepresentante)}
                      helperText={touched.nomeRepresentante && errors.nomeRepresentante}
                      placeholder="João da Silva"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ...inputSx, mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Email (será seu login)"
                      name="emailRepresentante"
                      type="email"
                      value={values.emailRepresentante}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.emailRepresentante && Boolean(errors.emailRepresentante)}
                      helperText={touched.emailRepresentante && errors.emailRepresentante}
                      placeholder="joao.silva@empresa.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </Paper>

                  {/* Acesso ao Sistema */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon color="primary" /> Acesso ao Sistema
                    </Typography>

                    <TextField
                      fullWidth
                      label="Defina uma Senha"
                      name="senhaRepresentante"
                      type={showPassword ? 'text' : 'password'}
                      value={values.senhaRepresentante}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.senhaRepresentante && Boolean(errors.senhaRepresentante)}
                      helperText={touched.senhaRepresentante && errors.senhaRepresentante}
                      placeholder="Mínimo 8 caracteres"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ...inputSx, mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Confirme a Senha"
                      name="confirmSenha"
                      type={showPassword ? 'text' : 'password'}
                      value={values.confirmSenha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmSenha && Boolean(errors.confirmSenha)}
                      helperText={touched.confirmSenha && errors.confirmSenha}
                      placeholder="Confirme a senha"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </Paper>

                  {/* Botão Submit */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
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
                    {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>

                  <Divider sx={{ my: 3 }}>
                    <Chip label="ou" size="small" />
                  </Divider>

                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      component={Link}
                      to="/login"
                      variant="text"
                      sx={{ fontWeight: 600 }}
                    >
                      Já tem cadastro? Fazer login
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;