import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  Campaign as CampaignIcon,
  CheckCircle as CheckIcon,
  CleaningServices as CleaningIcon,
  Groups as GroupsIcon,
  Handshake as HandshakeIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  Park as ParkIcon,
  Person as PersonIcon,
  Public as PublicIcon,
  ReportProblem as ReportIcon,
  VolunteerActivism as VolunteerIcon,
} from '@mui/icons-material';
import ImpactDashboard from './ImpactDashboard';

const Landing = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const participants = [
    {
      icon: GroupsIcon,
      title: 'Comunidade',
      description: 'Moradores registram necessidades, acompanham melhorias e ajudam a priorizar o cuidado com o bairro.',
      color: theme.palette.primary.main,
      items: ['Dar visibilidade aos problemas', 'Apoiar ocorrências da vizinhança', 'Indicar praças para adoção'],
    },
    {
      icon: HandshakeIcon,
      title: 'Empresas parceiras',
      description: 'Negócios locais transformam responsabilidade social em cuidado contínuo e próximo das pessoas.',
      color: theme.palette.secondary.main,
      items: ['Adotar e revitalizar praças', 'Apresentar planos de manutenção', 'Fortalecer vínculos locais'],
    },
    {
      icon: CleaningIcon,
      title: 'Zeladoria urbana',
      description: 'O poder público recebe informações organizadas e acompanha as ações que melhoram os espaços comuns.',
      color: theme.palette.success.main,
      items: ['Visualizar demandas no mapa', 'Analisar propostas de adoção', 'Acompanhar prioridades'],
    },
  ];

  const journey = [
    { icon: LocationIcon, title: 'Observe o bairro', text: 'Identifique uma praça que precisa de cuidado ou uma ocorrência urbana.' },
    { icon: CampaignIcon, title: 'Compartilhe a necessidade', text: 'Registre a situação para que comunidade e zeladoria possam acompanhar.' },
    { icon: HandshakeIcon, title: 'Conecte quem pode ajudar', text: 'Empresas encontram espaços disponíveis e apresentam propostas de adoção.' },
    { icon: CheckIcon, title: 'Acompanhe a transformação', text: 'Todos enxergam o andamento e os resultados para a vizinhança.' },
  ];

  const careItems = [
    { icon: CleaningIcon, label: 'Limpeza e conservação', color: 'success.main' },
    { icon: ParkIcon, label: 'Praças vivas e acolhedoras', color: 'primary.main' },
    { icon: ReportIcon, label: 'Problemas urbanos visíveis', color: 'secondary.main' },
    { icon: VolunteerIcon, label: 'Participação que gera cuidado', color: 'warning.dark' },
  ];

  return (
    <Box sx={{ overflowX: 'hidden', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.92),
          color: 'text.primary',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flexGrow: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}><GroupsIcon /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight={850} lineHeight={1}>Communitex</Typography>
                <Typography variant="caption" color="text.secondary">Comunidade que cuida</Typography>
              </Box>
            </Stack>
            <Button component={Link} to="/guia" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>Como funciona</Button>
            <Button component={Link} to="/login" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Entrar</Button>
            <Button variant="contained" onClick={(event) => setAnchorEl(event.currentTarget)} endIcon={<ArrowDropDownIcon />}>
              Participar
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem component={Link} to="/register/pessoa-fisica" onClick={() => setAnchorEl(null)}>
                <PersonIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Sou morador
              </MenuItem>
              <MenuItem component={Link} to="/register" onClick={() => setAnchorEl(null)}>
                <BusinessIcon sx={{ mr: 1.5, color: 'secondary.main' }} /> Represento uma empresa
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="section"
        sx={{
          pt: { xs: 14, md: 17 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          background: `linear-gradient(145deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter} 100%)`,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            right: -180,
            top: -180,
            bgcolor: alpha(theme.palette.secondary.main, 0.12),
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip icon={<PublicIcon />} label="Zeladoria colaborativa para bairros melhores" color="primary" variant="outlined" sx={{ mb: 3, bgcolor: alpha(theme.palette.background.paper, 0.7) }} />
              <Typography variant="h1" sx={{ fontSize: { xs: '2.65rem', sm: '3.6rem', lg: '4.7rem' }, lineHeight: 1.03, maxWidth: 760 }}>
                Cuidar da cidade começa{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>perto de casa.</Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 3, maxWidth: 650, lineHeight: 1.7, fontWeight: 400 }}>
                Uma plataforma para moradores, empresas e poder público transformarem necessidades do bairro em ações de cuidado, adoção e manutenção dos espaços comuns.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button component={Link} to="/register/pessoa-fisica" variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ px: 4 }}>
                  Quero cuidar do meu bairro
                </Button>
                <Button component={Link} to="/login" variant="outlined" size="large" startIcon={<MapIcon />} sx={{ px: 4, bgcolor: alpha(theme.palette.background.paper, 0.65) }}>
                  Acessar a plataforma
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: { xs: 2.5, md: 3 }, bgcolor: alpha(theme.palette.background.paper, 0.9), boxShadow: '0 28px 70px rgba(13,73,71,0.17)' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}><LocationIcon /></Avatar>
                  <Box>
                    <Typography fontWeight={800}>O bairro em movimento</Typography>
                    <Typography variant="body2" color="text.secondary">Cuidado compartilhado em um só lugar</Typography>
                  </Box>
                </Stack>
                <Stack spacing={1.5}>
                  {careItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.75, borderRadius: 3, bgcolor: 'background.default' }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: item.color, width: 38, height: 38 }}><Icon fontSize="small" /></Avatar>
                        <Typography fontWeight={650}>{item.label}</Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <ImpactDashboard />

      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 720, mb: 6 }}>
            <Typography variant="overline" color="secondary.main" fontWeight={850} letterSpacing={2}>UMA REDE DE CUIDADO</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mt: 1 }}>Cada pessoa tem um papel na zeladoria da cidade.</Typography>
            <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.05rem' }}>O Communitex organiza a colaboração para que demandas locais encontrem respostas e parceiros.</Typography>
          </Box>
          <Grid container spacing={3}>
            {participants.map((participant) => {
              const Icon = participant.icon;
              return (
                <Grid item xs={12} md={4} key={participant.title}>
                  <Card sx={{ height: '100%', borderTop: `5px solid ${participant.color}` }}>
                    <CardContent sx={{ p: 3.5 }}>
                      <Avatar sx={{ bgcolor: alpha(participant.color, 0.12), color: participant.color, width: 54, height: 54, mb: 2.5 }}><Icon /></Avatar>
                      <Typography variant="h5" fontWeight={800}>{participant.title}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.7 }}>{participant.description}</Typography>
                      <Stack spacing={1.25}>
                        {participant.items.map((item) => <Stack key={item} direction="row" spacing={1} alignItems="center"><CheckIcon sx={{ color: participant.color, fontSize: 18 }} /><Typography variant="body2">{item}</Typography></Stack>)}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={7} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="overline" color="primary.main" fontWeight={850} letterSpacing={2}>COMO FUNCIONA</Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mt: 1 }}>Do olhar atento à ação concreta.</Typography>
              <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                A tecnologia aproxima quem percebe um problema, quem pode ajudar e quem coordena o cuidado com a cidade.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button component={Link} to="/guia" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>Ver guia completo</Button>
                <Button component={Link} to="/register/pessoa-fisica" variant="outlined">Começar a participar</Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                {journey.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Paper key={step.title} variant="outlined" sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2.5, bgcolor: 'background.paper' }}>
                      <Avatar sx={{ bgcolor: index % 2 ? 'secondary.main' : 'primary.main', width: 48, height: 48 }}><Icon /></Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={800}>{index + 1}. {step.title}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>{step.text}</Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'primary.dark', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative' }}>
          <GroupsIcon sx={{ fontSize: 54, color: 'secondary.light', mb: 2 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.2rem' } }}>Seu bairro também pode ser mais cuidado.</Typography>
          <Typography sx={{ mt: 2, mb: 4, color: alpha('#fff', 0.78), fontSize: '1.08rem', lineHeight: 1.7 }}>
            Participe da rede que transforma informação, parceria e presença comunitária em espaços públicos melhores para todos.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={Link} to="/register/pessoa-fisica" variant="contained" color="secondary" size="large">Cadastrar como morador</Button>
            <Button component={Link} to="/register" variant="outlined" size="large" sx={{ color: 'white', borderColor: alpha('#fff', 0.5), '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.08) } }}>Quero ser empresa parceira</Button>
          </Stack>
        </Container>
      </Box>

      <Box component="footer" sx={{ bgcolor: '#092f2e', color: 'white', py: 5 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={3}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: 'secondary.main' }}><GroupsIcon /></Avatar>
              <Box><Typography variant="h6" fontWeight={850}>Communitex</Typography><Typography variant="caption" sx={{ color: alpha('#fff', 0.65) }}>Comunidade, parceria e zeladoria urbana.</Typography></Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton component={Link} to="/login" sx={{ color: 'white' }} aria-label="Entrar"><PersonIcon /></IconButton>
              <IconButton component={Link} to="/register" sx={{ color: 'white' }} aria-label="Cadastro de empresa"><BusinessIcon /></IconButton>
            </Stack>
          </Stack>
          <Divider sx={{ my: 4, borderColor: alpha('#fff', 0.12) }} />
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.55) }}>© {new Date().getFullYear()} Communitex. Cuidar do comum aproxima pessoas.</Typography>
        </Container>
      </Box>
    </Box>
  );
};

export { Landing };
