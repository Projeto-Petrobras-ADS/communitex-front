import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
  Login as LoginIcon,
  Park as ParkIcon,
  Handshake as HandshakeIcon,
  Public as PublicIcon,
  Groups as GroupsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const Login = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);

    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Usuário ou senha inválidos. Tente novamente.');
    }
  };

  const benefits = [
    { icon: <ParkIcon />, text: 'Adote praças e transforme espaços' },
    { icon: <HandshakeIcon />, text: 'Visibilidade para sua marca' },
    { icon: <PublicIcon />, text: 'Sustentabilidade urbana' },
    { icon: <GroupsIcon />, text: 'Conecte-se com a comunidade' },
  ];

  const stats = [
    { value: '150+', label: 'Praças' },
    { value: '80+', label: 'Adotantes' },
    { value: '98%', label: 'Satisfação' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Painel Lateral com Informações */}
      <Box
        sx={{
          flex: { md: '0 0 50%' },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          p: { xs: 4, md: 6 },
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
        <Box sx={{ maxWidth: 450, mx: 'auto', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
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
            label="Alinhado com a ODS 11" 
            icon={<PublicIcon />}
            sx={{ 
              mb: 4, 
              bgcolor: 'rgba(255,255,255,0.15)', 
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              '& .MuiChip-icon': { color: 'white' }
            }} 
          />

          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Por que participar?
          </Typography>
          <Stack spacing={2.5} sx={{ mb: 5 }}>
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
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                  {benefit.icon}
                </Avatar>
                <Typography fontWeight={500}>{benefit.text}</Typography>
              </Box>
            ))}
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 4,
            }}
          >
            <Stack direction="row" justifyContent="space-around">
              {stats.map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={800}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1.5 }}>
              Ainda não tem conta?
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Empresa
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
                Pessoa Física
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Formulário de Login */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{
            position: 'absolute',
            top: 24,
            left: 24,
            color: 'text.secondary',
          }}
        >
          Voltar
        </Button>

        <Card 
          elevation={0}
          sx={{ 
            maxWidth: 450, 
            width: '100%', 
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 4 }}>
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
                <LoginIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Bem-vindo!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Acesse sua conta para continuar
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Usuário"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="seu_usuario"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
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
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                sx={{ 
                  py: 1.8, 
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                  '&:hover': {
                    boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.45)}`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <Divider sx={{ my: 4 }}>
              <Chip label="ou cadastre-se" size="small" />
            </Divider>

            <Stack spacing={1.5}>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                fullWidth
                sx={{ 
                  py: 1.2, 
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Cadastro de Empresa
              </Button>
              <Button
                component={Link}
                to="/register/pessoa-fisica"
                variant="text"
                fullWidth
                sx={{ py: 1 }}
              >
                Cadastro de Pessoa Física
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
