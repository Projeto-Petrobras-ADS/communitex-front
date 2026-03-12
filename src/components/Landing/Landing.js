import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Stack,
  Divider,
  Chip,
  Avatar,
  Paper,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  Handshake as HandshakeIcon,
  Park as ParkIcon,
  LocationOn as LocationIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  CleaningServices as CleaningIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowForward as ArrowForwardIcon,
  Public as PublicIcon,
  EnergySavingsLeaf as EcoIcon,
  Groups as GroupsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Nature as NatureIcon,
  Star as StarIcon,
  FormatQuote as QuoteIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';

const Landing = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const features = [
    {
      icon: <HandshakeIcon sx={{ fontSize: 32 }} />,
      title: 'Parceria Público-Privada',
      description: 'Conectamos empresas, cidadãos e o poder público em um programa de cooperação para manter e revitalizar espaços públicos.',
    },
    {
      icon: <ParkIcon sx={{ fontSize: 32 }} />,
      title: 'Impacto Ambiental Positivo',
      description: 'Contribua para a preservação de áreas verdes, limpeza, jardinagem e manutenção de espaços que beneficiam toda a comunidade.',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 32 }} />,
      title: 'Visibilidade da Marca',
      description: 'Adotantes têm direito de instalar placa de identificação no espaço, ganhando visibilidade de acordo com as normas do programa.',
    },
    {
      icon: <EcoIcon sx={{ fontSize: 32 }} />,
      title: 'ODS 11 - Cidades Sustentáveis',
      description: 'Alinhado com os Objetivos de Desenvolvimento Sustentável da ONU para cidades mais inclusivas, seguras e sustentáveis.',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 32 }} />,
      title: 'Engajamento Comunitário',
      description: 'Fortaleça o vínculo com a comunidade local através de ações que impactam diretamente a qualidade de vida dos cidadãos.',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      title: 'Processo Transparente',
      description: 'Acompanhe todo o processo de adoção de forma digital, desde a proposta até a formalização do termo de cooperação.',
    },
  ];

  const steps = [
    { number: '01', icon: <PersonAddIcon />, title: 'Cadastre-se', description: 'Crie sua conta como empresa ou pessoa física em poucos minutos.' },
    { number: '02', icon: <SearchIcon />, title: 'Explore', description: 'Navegue pelas praças disponíveis em sua região.' },
    { number: '03', icon: <DescriptionIcon />, title: 'Proponha', description: 'Detalhe seu plano de manutenção e melhorias.' },
    { number: '04', icon: <BuildIcon />, title: 'Adote', description: 'Formalize a parceria e comece a transformar.' },
  ];

  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Diretora de ESG',
      company: 'TechCorp Brasil',
      avatar: 'M',
      content: 'O programa de adoção de praças transformou nossa estratégia de responsabilidade social. A comunidade reconhece nosso compromisso.',
      rating: 5,
    },
    {
      name: 'João Silva',
      role: 'Empresário',
      company: 'Padaria Bom Pão',
      avatar: 'J',
      content: 'Adotar a praça do nosso bairro foi a melhor decisão. Nossos clientes nos veem de forma diferente agora.',
      rating: 5,
    },
    {
      name: 'Ana Costa',
      role: 'Cidadã',
      company: 'Moradora do Centro',
      avatar: 'A',
      content: 'Como pessoa física, consegui adotar a praça onde levo meus filhos. É gratificante ver o espaço sempre bem cuidado.',
      rating: 5,
    },
  ];

  const stats = [
    { value: '150+', label: 'Praças Adotadas', description: 'espaços transformados' },
    { value: '80+', label: 'Parceiros', description: 'empresas engajadas' },
    { value: '12', label: 'Cidades', description: 'em todo o Brasil' },
    { value: '98%', label: 'Satisfação', description: 'dos adotantes' },
  ];

  const responsibilities = [
    {
      icon: <CleaningIcon />,
      title: 'Manutenção Regular',
      color: theme.palette.success.main,
      items: ['Limpeza e remoção de lixo', 'Corte de grama e jardinagem', 'Cuidado com a iluminação'],
    },
    {
      icon: <BuildIcon />,
      title: 'Pequenos Reparos',
      color: theme.palette.primary.main,
      items: ['Manutenção de bancos e lixeiras', 'Conservação de estruturas', 'Cuidados gerais do espaço'],
    },
    {
      icon: <MoneyIcon />,
      title: 'Responsabilidade',
      color: theme.palette.warning.main,
      items: ['Custeio das atividades', 'Cumprimento do acordo', 'Relatórios periódicos'],
    },
  ];

  return (
    <Box sx={{ overflowX: 'hidden', bgcolor: 'background.default' }}>
      {/* Header/AppBar - Modern Glass Effect */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                }}
              >
                <ParkIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                Communitex
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                }}
              >
                Entrar
              </Button>
              <Button
                onClick={handleMenuOpen}
                variant="contained"
                endIcon={<ArrowDropDownIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                }}
              >
                Cadastre-se
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { 
                    borderRadius: 3, 
                    mt: 1.5, 
                    minWidth: 220,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }
                }}
              >
                <MenuItem component={Link} to="/register" onClick={handleMenuClose} sx={{ py: 1.5, px: 2.5 }}>
                  <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} /> Sou Empresa
                </MenuItem>
                <MenuItem component={Link} to="/register/pessoa-fisica" onClick={handleMenuClose} sx={{ py: 1.5, px: 2.5 }}>
                  <PersonIcon sx={{ mr: 2, color: 'secondary.main' }} /> Pessoa Física
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section - Marketing Style */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: `linear-gradient(160deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
          pt: { xs: 12, md: 8 },
          pb: { xs: 8, md: 0 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '70%',
            height: '150%',
            background: `radial-gradient(ellipse, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '50%',
            height: '80%',
            background: `radial-gradient(ellipse, ${alpha(theme.palette.success.main, 0.06)} 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label="ODS 11 - Cidades Sustentáveis" 
                  icon={<PublicIcon sx={{ fontSize: 18 }} />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                    py: 2.5,
                    px: 0.5,
                    '& .MuiChip-icon': { color: 'primary.main' },
                    '& .MuiChip-label': { px: 1 },
                  }} 
                />
              </Box>
              <Typography 
                variant="h1" 
                fontWeight={800} 
                color="text.primary"
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.1,
                  mb: 3,
                  letterSpacing: '-1px',
                }}
              >
                Adote uma praça.{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Transforme sua cidade.
                </Box>
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary',
                  fontWeight: 400,
                  maxWidth: 480,
                  lineHeight: 1.7,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                Conectamos empresas, cidadãos e o poder público para revitalizar 
                espaços públicos mais verdes, seguros e acessíveis.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Começar agora
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderWidth: 2,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { 
                      borderWidth: 2,
                      borderColor: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    } 
                  }}
                >
                  Já tenho conta
                </Button>
              </Stack>
              {/* Trust badges */}
              <Stack direction="row" spacing={3} alignItems="center">
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Empresas que confiam:
                </Typography>
                <Stack direction="row" spacing={2}>
                  {['TechCorp', 'EcoBrasil', 'GreenCo'].map((company) => (
                    <Typography 
                      key={company} 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 600, 
                        opacity: 0.6,
                        letterSpacing: '0.5px',
                      }}
                    >
                      {company}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              {/* Stats Cards - Modern Style */}
              <Box sx={{ position: 'relative' }}>
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.12)}`,
                            transform: 'translateY(-4px)',
                          },
                        }}
                      >
                        <Typography 
                          variant="h3" 
                          fontWeight={800} 
                          sx={{ 
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {stat.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Marketing Style */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography 
              variant="overline" 
              color="primary.main" 
              fontWeight={700}
              sx={{ letterSpacing: 2, mb: 2, display: 'block' }}
            >
              POR QUE ADOTAR
            </Typography>
            <Typography 
              variant="h2" 
              fontWeight={800} 
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.5px',
              }}
            >
              Benefícios para todos
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
            >
              Um programa que conecta responsabilidade social, sustentabilidade e visibilidade
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%', 
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
                      '& .feature-icon': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        transform: 'scale(1.1)',
                      }
                    }
                  }}
                >
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 14 }, 
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography 
                variant="overline" 
                color="primary.main" 
                fontWeight={700}
                sx={{ letterSpacing: 2, mb: 2, display: 'block' }}
              >
                COMO FUNCIONA
              </Typography>
              <Typography 
                variant="h2" 
                fontWeight={800} 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  letterSpacing: '-0.5px',
                }}
              >
                Simples e transparente
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 4, lineHeight: 1.8 }}
              >
                Um processo digital completo que conecta você ao espaço público 
                que deseja adotar. Da proposta à formalização, tudo acontece de 
                forma rápida e transparente.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<KeyboardArrowRightIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Comece sua jornada
              </Button>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                {steps.map((step, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box 
                      sx={{ 
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
                          '& .step-number': {
                            bgcolor: 'primary.main',
                            color: 'white',
                          }
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography 
                          className="step-number"
                          variant="caption"
                          sx={{ 
                            fontWeight: 800,
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {step.number}
                        </Typography>
                        <Box sx={{ color: 'primary.main' }}>{step.icon}</Box>
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography 
              variant="overline" 
              color="primary.main" 
              fontWeight={700}
              sx={{ letterSpacing: 2, mb: 2, display: 'block' }}
            >
              DEPOIMENTOS
            </Typography>
            <Typography 
              variant="h2" 
              fontWeight={800} 
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.5px',
              }}
            >
              O que dizem nossos parceiros
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
                    }
                  }}
                >
                  <QuoteIcon 
                    sx={{ 
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontSize: 40,
                      color: alpha(theme.palette.primary.main, 0.1),
                    }} 
                  />
                  <Stack direction="row" spacing={0.5} sx={{ mb: 3 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ fontSize: 18, color: 'secondary.main' }} />
                    ))}
                  </Stack>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ mb: 4, lineHeight: 1.8, fontStyle: 'italic' }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48,
                        fontWeight: 700,
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role} - {testimonial.company}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Responsibilities Section */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 14 }, 
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography 
              variant="overline" 
              color="primary.main" 
              fontWeight={700}
              sx={{ letterSpacing: 2, mb: 2, display: 'block' }}
            >
              COMPROMISSOS
            </Typography>
            <Typography 
              variant="h2" 
              fontWeight={800} 
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.5px',
              }}
            >
              Responsabilidades do adotante
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
            >
              Saiba o que é esperado de quem adota um espaço público
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {responsibilities.map((resp, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 20px 40px ${alpha(resp.color, 0.15)}`,
                      borderColor: resp.color,
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      background: `linear-gradient(135deg, ${resp.color} 0%, ${alpha(resp.color, 0.8)} 100%)`,
                      color: 'white',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      {resp.icon}
                      <Typography variant="h6" fontWeight={700}>
                        {resp.title}
                      </Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {resp.items.map((item, idx) => (
                        <Stack key={idx} direction="row" spacing={2} alignItems="center">
                          <CheckIcon sx={{ color: resp.color, fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Marketing Style */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `radial-gradient(circle at 20% 50%, white 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, white 0%, transparent 40%)`,
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            fontWeight={800} 
            color="white"
            sx={{ 
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
              letterSpacing: '-0.5px',
            }}
          >
            Pronto para fazer a diferença?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5, 
              color: 'rgba(255,255,255,0.85)', 
              maxWidth: 500, 
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Junte-se a mais de 80 empresas e cidadãos que já estão transformando 
            suas cidades através da adoção de praças.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main', 
                px: 5,
                py: 1.8,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: `0 8px 30px ${alpha(theme.palette.primary.dark, 0.35)}`,
                '&:hover': { 
                  bgcolor: alpha('#fff', 0.92),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.dark, 0.45)}`,
                },
                transition: 'all 0.2s ease',
              }}
            >
              Começar agora
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.4)', 
                color: 'white',
                px: 5,
                py: 1.8,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                  borderWidth: 2,
                } 
              }}
            >
              Entrar
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer - Modern Style */}
      <Box sx={{ bgcolor: theme.palette.primary.dark, color: 'white', pt: 10, pb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ParkIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight={800}>
                  Communitex
                </Typography>
              </Stack>
              <Typography variant="body2" color="grey.400" sx={{ mb: 3, lineHeight: 1.8, maxWidth: 300 }}>
                Transformando cidades através de praças mais verdes e sustentáveis. 
                Juntos construímos comunidades melhores.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'grey.400',
                    '&:hover': { color: 'primary.light', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small"
                  sx={{ 
                    color: 'grey.400',
                    '&:hover': { color: 'primary.light', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small"
                  sx={{ 
                    color: 'grey.400',
                    '&:hover': { color: 'primary.light', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <TwitterIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2.5, color: 'grey.300' }}>
                Programa
              </Typography>
              <Stack spacing={1.5}>
                {['Sobre', 'Como funciona', 'Benefícios', 'FAQ'].map((link) => (
                  <Typography 
                    key={link} 
                    variant="body2" 
                    color="grey.500"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.light' }
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2.5, color: 'grey.300' }}>
                Recursos
              </Typography>
              <Stack spacing={1.5}>
                {['Praças', 'Documentação', 'Blog', 'Suporte'].map((link) => (
                  <Typography 
                    key={link} 
                    variant="body2" 
                    color="grey.500"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.light' }
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2.5, color: 'grey.300' }}>
                Contato
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                  </Box>
                  <Typography variant="body2" color="grey.400">
                    contato@communitex.com
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PhoneIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                  </Box>
                  <Typography variant="body2" color="grey.400">
                    (47) 1234-5678
                  </Typography>
                </Stack>
              </Stack>
              <Chip 
                icon={<PublicIcon sx={{ fontSize: 16 }} />} 
                label="ODS 11 - Cidades Sustentáveis" 
                size="small"
                sx={{ 
                  mt: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.light',
                  '& .MuiChip-icon': { color: 'primary.light' },
                  fontWeight: 500,
                }}
              />
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: alpha('#fff', 0.08), mb: 4 }} />
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color={alpha('#fff', 0.5)}>
              © {new Date().getFullYear()} Communitex. Todos os direitos reservados.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                variant="body2"
                color={alpha('#fff', 0.45)}
                sx={{ cursor: 'pointer', '&:hover': { color: alpha('#fff', 0.8) } }}
              >
                Termos de Uso
              </Typography>
              <Typography
                variant="body2"
                color={alpha('#fff', 0.45)}
                sx={{ cursor: 'pointer', '&:hover': { color: alpha('#fff', 0.8) } }}
              >
                Política de Privacidade
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export { Landing };