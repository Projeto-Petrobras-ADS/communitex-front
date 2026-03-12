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
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Park as ParkIcon,
  Public as PublicIcon,
  Groups as GroupsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationCity as LocationCityIcon,
  Map as MapIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Handshake as HandshakeIcon,
} from '@mui/icons-material';

const RegisterPessoaFisicaSchema = Yup.object().shape({
  nome: Yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .required('Nome é obrigatório'),
  
  cpf: Yup.string()
    .matches(/^[0-9]{11}$/, 'CPF deve conter 11 números (sem pontos ou traços)')
    .required('CPF é obrigatório'),
  
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  
  telefone: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Telefone deve conter 10 ou 11 números')
    .required('Telefone é obrigatório'),
  
  endereco: Yup.string()
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .required('Endereço é obrigatório'),
  
  bairro: Yup.string()
    .required('Bairro é obrigatório'),
  
  cidade: Yup.string()
    .required('Cidade é obrigatória'),
  
  estado: Yup.string()
    .length(2, 'Estado deve ter 2 caracteres (ex: SC)')
    .required('Estado é obrigatório'),
  
  cep: Yup.string()
    .matches(/^[0-9]{8}$/, 'CEP deve conter 8 números (sem traço)')
    .required('CEP é obrigatório'),
  
  senha: Yup.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Senha deve conter maiúsculas, minúsculas, números e caracteres especiais'
    )
    .required('Senha é obrigatória'),
  
  confirmSenha: Yup.string()
    .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  
  termos: Yup.boolean()
    .oneOf([true], 'Você deve aceitar os termos de uso'),
});

const RegisterPessoaFisica = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError('');
    
    const pessoaFisicaDTO = {
      nome: values.nome,
      cpf: values.cpf,
      email: values.email,
      telefone: values.telefone,
      endereco: values.endereco,
      bairro: values.bairro,
      cidade: values.cidade,
      estado: values.estado,
      cep: values.cep,
      senha: values.senha,
    };

    try {
      await api.post('/api/pessoas-fisicas', pessoaFisicaDTO);
      
      setSubmitting(false);
      
      alert('Cadastro realizado com sucesso! Você já pode fazer o login com seu email e senha.');
      navigate('/login');

    } catch (err) {
      console.error('Erro no cadastro:', err);
      setSubmitting(false);
      
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const mensagens = err.response.data.errors
          .map(e => e.message)
          .join(', ');
        setServerError(mensagens);
      } else {
        setServerError('Erro ao realizar o cadastro. Verifique os dados e tente novamente.');
      }
    }
  };

  const benefits = [
    { icon: <AssignmentIcon />, text: 'Cadastre praças de sua comunidade' },
    { icon: <TrendingUpIcon />, text: 'Acompanhe o interesse das empresas' },
    { icon: <PublicIcon />, text: 'Participe da transformação urbana' },
    { icon: <HandshakeIcon />, text: 'Conecte-se com empresas parceiras' },
  ];

  const stats = [
    { value: '150+', label: 'Praças' },
    { value: '80+', label: 'Cidadãos' },
    { value: '50+', label: 'Bairros' },
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
            label="Cadastro Cidadão" 
            icon={<PersonIcon />}
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
            Por que se cadastrar?
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
              to="/register"
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
              Cadastro de Empresa
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
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Cadastro de Pessoa Física
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cadastre-se para participar da plataforma e cadastrar praças para adoção
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
                nome: '',
                cpf: '',
                email: '',
                telefone: '',
                endereco: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
                senha: '',
                confirmSenha: '',
                termos: false,
              }}
              validationSchema={RegisterPessoaFisicaSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                <Form>
                  {/* Dados Pessoais */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BadgeIcon color="primary" /> Dados Pessoais
                    </Typography>

                    <TextField
                      fullWidth
                      label="Nome Completo"
                      name="nome"
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nome && Boolean(errors.nome)}
                      helperText={touched.nome && errors.nome}
                      placeholder="João da Silva Santos"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ...inputSx, mb: 2 }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="CPF (somente números)"
                        name="cpf"
                        value={values.cpf}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.cpf && Boolean(errors.cpf)}
                        helperText={touched.cpf && errors.cpf}
                        placeholder="12345678910"
                        inputProps={{ maxLength: 11 }}
                        sx={inputSx}
                      />

                      <TextField
                        fullWidth
                        label="Telefone (com DDD)"
                        name="telefone"
                        value={values.telefone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.telefone && Boolean(errors.telefone)}
                        helperText={touched.telefone && errors.telefone}
                        placeholder="4733333333"
                        inputProps={{ maxLength: 11 }}
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

                  {/* Dados de Contato */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="primary" /> Dados de Contato
                    </Typography>

                    <TextField
                      fullWidth
                      label="Email (será seu login)"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      placeholder="joao@email.com"
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

                  {/* Endereço */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HomeIcon color="primary" /> Endereço
                    </Typography>

                    <TextField
                      fullWidth
                      label="Endereço (Rua, Avenida, etc.)"
                      name="endereco"
                      value={values.endereco}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.endereco && Boolean(errors.endereco)}
                      helperText={touched.endereco && errors.endereco}
                      placeholder="Rua Principal, 123"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ ...inputSx, mb: 2 }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Bairro"
                        name="bairro"
                        value={values.bairro}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.bairro && Boolean(errors.bairro)}
                        helperText={touched.bairro && errors.bairro}
                        placeholder="Centro"
                        sx={inputSx}
                      />

                      <TextField
                        fullWidth
                        label="Cidade"
                        name="cidade"
                        value={values.cidade}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.cidade && Boolean(errors.cidade)}
                        helperText={touched.cidade && errors.cidade}
                        placeholder="Florianópolis"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationCityIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Estado (UF)"
                        name="estado"
                        value={values.estado}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.estado && Boolean(errors.estado)}
                        helperText={touched.estado && errors.estado}
                        placeholder="SC"
                        inputProps={{ maxLength: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MapIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />

                      <TextField
                        fullWidth
                        label="CEP (somente números)"
                        name="cep"
                        value={values.cep}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.cep && Boolean(errors.cep)}
                        helperText={touched.cep && errors.cep}
                        placeholder="88000000"
                        inputProps={{ maxLength: 8 }}
                        sx={inputSx}
                      />
                    </Stack>
                  </Paper>

                  {/* Acesso ao Sistema */}
                  <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon color="primary" /> Acesso ao Sistema
                    </Typography>

                    <TextField
                      fullWidth
                      label="Senha"
                      name="senha"
                      type={showPassword ? 'text' : 'password'}
                      value={values.senha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.senha && Boolean(errors.senha)}
                      helperText={touched.senha && errors.senha ? errors.senha : 'Deve conter maiúsculas, minúsculas, números e caracteres especiais'}
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
                      placeholder="Repita a senha"
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

                  {/* Termos */}
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="termos"
                          checked={values.termos}
                          onChange={(e) => setFieldValue('termos', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Aceito os{' '}
                          <Link to="#" onClick={(e) => e.preventDefault()} style={{ color: theme.palette.primary.main }}>
                            termos de uso
                          </Link>{' '}
                          e a{' '}
                          <Link to="#" onClick={(e) => e.preventDefault()} style={{ color: theme.palette.primary.main }}>
                            política de privacidade
                          </Link>
                        </Typography>
                      }
                    />
                    {touched.termos && errors.termos && (
                      <FormHelperText error sx={{ ml: 4 }}>
                        {errors.termos}
                      </FormHelperText>
                    )}
                  </Box>

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

export default RegisterPessoaFisica;