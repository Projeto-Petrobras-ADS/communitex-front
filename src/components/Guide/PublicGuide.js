import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, AppBar, Avatar, Box,
  Button, Card, CardContent, Chip, Container, Divider, Grid, Paper, Stack,
  Toolbar, Typography, alpha, useTheme,
} from '@mui/material';
import {
  AdminPanelSettingsOutlined, ArrowBack, ArrowForward, BusinessOutlined,
  CampaignOutlined, CheckCircleOutline, ExpandMore, FactCheckOutlined,
  GroupsOutlined, HandshakeOutlined, LocationOnOutlined, MapOutlined,
  ParkOutlined, PersonOutline, PhotoCameraOutlined, PlayArrowOutlined,
  ReportProblemOutlined, SearchOutlined, SendOutlined, VisibilityOutlined,
} from '@mui/icons-material';

const roles = [
  [PersonOutline, 'Morador', 'primary', 'Identifica necessidades, cadastra praças, registra denúncias, apoia demandas e confirma se um reparo foi realmente concluído.'],
  [BusinessOutlined, 'Empresa parceira', 'secondary', 'Envia propostas de adoção para praças disponíveis e pode assumir demandas de reparo publicadas pela comunidade.'],
  [AdminPanelSettingsOutlined, 'Administração', 'success', 'Analisa as propostas de adoção enviadas pelas empresas e decide pela aprovação ou rejeição.'],
];

const adoptionSteps = [
  ['Encontre uma praça disponível', 'A empresa acessa o catálogo e escolhe uma praça com status Disponível.', SearchOutlined],
  ['Envie uma proposta', 'A empresa descreve melhorias, manutenção, equipe envolvida e benefícios para a comunidade.', SendOutlined],
  ['Aguarde a análise', 'A proposta fica visível para a administração, que pode aprovar ou rejeitar o plano.', FactCheckOutlined],
  ['Comece a adoção', 'Quando aprovada, a praça passa a ser considerada adotada e o compromisso fica registrado.', HandshakeOutlined],
];

const issueSteps = [
  ['Marque o local no mapa', 'O morador seleciona a localização exata do problema urbano.', LocationOnOutlined],
  ['Descreva a ocorrência', 'Informe tipo, título e descrição. Uma foto pode ser anexada para dar mais contexto.', PhotoCameraOutlined],
  ['Acompanhe e receba apoio', 'A denúncia fica visível no mapa para acompanhamento e participação da comunidade.', VisibilityOutlined],
  ['Empresa assume o reparo', 'Uma empresa descreve o plano, inicia o atendimento e envia a conclusão com evidência.', PlayArrowOutlined],
  ['Autor confirma ou contesta', 'O morador que registrou a denúncia valida o reparo. Ao confirmar, a denúncia é resolvida.', CheckCircleOutline],
];

const statusGroups = [
  ['Praças', ParkOutlined, [
    ['Disponível', 'Pode receber propostas de adoção.', 'success'],
    ['Em processo', 'Já possui proposta sendo analisada.', 'warning'],
    ['Adotada', 'Possui uma adoção aprovada.', 'primary'],
  ]],
  ['Propostas de adoção', HandshakeOutlined, [
    ['Proposta / Em análise', 'Aguardando decisão da administração.', 'warning'],
    ['Aprovada', 'Plano aceito e praça adotada.', 'success'],
    ['Rejeitada', 'Plano não aprovado.', 'error'],
    ['Finalizada', 'Ciclo de adoção encerrado.', 'default'],
  ]],
  ['Denúncias e reparos', ReportProblemOutlined, [
    ['Aberta', 'Disponível para acompanhamento e atendimento.', 'warning'],
    ['Em análise / Em andamento', 'Uma empresa assumiu ou iniciou o reparo.', 'info'],
    ['Aguardando confirmação', 'A empresa informou a conclusão; o autor deve validar.', 'warning'],
    ['Resolvida', 'Reparo confirmado pelo autor.', 'success'],
    ['Contestada', 'O autor informou que o problema ainda precisa de revisão.', 'error'],
  ]],
];

const questions = [
  ['Preciso estar cadastrado para participar?', 'Sim. Moradores e empresas possuem cadastros diferentes porque cada perfil pode realizar ações específicas na plataforma.'],
  ['Qualquer empresa pode adotar uma praça?', 'Uma empresa cadastrada pode enviar proposta para praças disponíveis. A adoção começa somente após a aprovação da administração.'],
  ['Uma denúncia é resolvida quando a empresa termina o serviço?', 'Ainda não. Após a empresa informar a conclusão, o autor da denúncia precisa confirmar o reparo para que ela seja marcada como resolvida.'],
  ['Posso apoiar uma denúncia já existente?', 'Sim. Apoiar uma ocorrência ajuda a dar visibilidade à demanda e evita registros duplicados para o mesmo problema.'],
];

const StepList = ({ steps, color }) => (
  <Stack spacing={2}>
    {steps.map(([title, text, Icon], index) => (
      <Paper key={title} variant="outlined" sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 44, height: 44 }}><Icon fontSize="small" /></Avatar>
        <Box>
          <Typography fontWeight={800}>{index + 1}. {title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.65 }}>{text}</Typography>
        </Box>
      </Paper>
    ))}
  </Stack>
);

const PublicGuide = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.94), color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(16px)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
            <Stack component={Link} to="/" direction="row" alignItems="center" spacing={1.25} sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}><GroupsOutlined /></Avatar>
              <Box><Typography fontWeight={850}>Communitex</Typography><Typography variant="caption" color="text.secondary">Guia da plataforma</Typography></Box>
            </Stack>
            <Button component={Link} to="/" startIcon={<ArrowBack />}>Voltar</Button>
            <Button component={Link} to="/login" variant="contained">Entrar</Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main">
        <Box sx={{ py: { xs: 8, md: 12 }, background: `linear-gradient(145deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`, color: 'white' }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Chip label="GUIA PARA MORADORES E EMPRESAS" sx={{ bgcolor: alpha('#fff', 0.14), color: 'white', mb: 3 }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.4rem', md: '4rem' }, lineHeight: 1.08 }}>Entenda como o cuidado vira ação.</Typography>
            <Typography sx={{ mt: 2.5, color: alpha('#fff', 0.8), fontSize: '1.1rem', lineHeight: 1.75 }}>
              Veja quem participa, como uma praça é adotada e o caminho completo de uma denúncia até a confirmação do reparo.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Button href="#adocao" variant="contained" color="secondary" startIcon={<ParkOutlined />}>Como adotar uma praça</Button>
              <Button href="#denuncias" variant="outlined" startIcon={<CampaignOutlined />} sx={{ color: 'white', borderColor: alpha('#fff', 0.55) }}>Como registrar denúncia</Button>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <Typography variant="overline" color="secondary.main" fontWeight={850}>QUEM FAZ O QUÊ</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4 }}>Uma plataforma, responsabilidades diferentes.</Typography>
          <Grid container spacing={3}>
            {roles.map(([Icon, title, color, text]) => (
              <Grid size={{ xs: 12, md: 4 }} key={title}>
                <Card sx={{ height: '100%', borderTop: '5px solid', borderTopColor: `${color}.main` }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette[color].main, 0.12), color: `${color}.main`, mb: 2 }}><Icon /></Avatar>
                    <Typography variant="h5" fontWeight={800}>{title}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>{text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box id="adocao" component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'background.paper', scrollMarginTop: 80 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Chip icon={<HandshakeOutlined />} label="Fluxo para empresas" color="secondary" variant="outlined" />
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mt: 2 }}>Como funciona a adoção de praças?</Typography>
                <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>A adoção não acontece automaticamente. A empresa envia um plano para uma praça disponível e a administração analisa a proposta.</Typography>
                <Alert severity="info" sx={{ mt: 3 }} icon={<FactCheckOutlined />}><strong>Quem aprova?</strong> A administração aprova ou rejeita a proposta. A empresa acompanha a decisão em “Minhas propostas”.</Alert>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}><StepList steps={adoptionSteps} color="secondary" /></Grid>
            </Grid>
          </Container>
        </Box>

        <Box id="denuncias" component="section" sx={{ py: { xs: 7, md: 10 }, scrollMarginTop: 80 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Chip icon={<MapOutlined />} label="Fluxo para moradores e empresas" color="primary" variant="outlined" />
                <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mt: 2 }}>Como uma denúncia vira reparo?</Typography>
                <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>O registro começa com o morador, pode ser atendido por uma empresa parceira e termina com a validação de quem relatou o problema.</Typography>
                <Alert severity="success" sx={{ mt: 3 }} icon={<CheckCircleOutline />}><strong>Quem confirma?</strong> O autor da denúncia confirma o reparo. Se ainda houver problema, pode contestar e encaminhar para revisão.</Alert>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}><StepList steps={issueSteps} color="primary" /></Grid>
            </Grid>
          </Container>
        </Box>

        <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="overline" color="secondary.main" fontWeight={850}>ACOMPANHAMENTO</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4 }}>O que cada status significa?</Typography>
            <Grid container spacing={3}>
              {statusGroups.map(([title, Icon, statuses]) => (
                <Grid size={{ xs: 12, md: 4 }} key={title}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}><Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}><Icon /></Avatar><Typography variant="h6" fontWeight={800}>{title}</Typography></Stack>
                      <Stack spacing={2}>
                        {statuses.map(([status, text, color], index) => (
                          <React.Fragment key={status}>
                            {index > 0 && <Divider />}
                            <Box><Chip label={status} color={color} size="small" sx={{ mb: 0.75 }} /><Typography variant="body2" color="text.secondary">{text}</Typography></Box>
                          </React.Fragment>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 } }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 3 }}>Dúvidas comuns</Typography>
          {questions.map(([question, answer]) => (
            <Accordion key={question} disableGutters>
              <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight={750}>{question}</Typography></AccordionSummary>
              <AccordionDetails><Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{answer}</Typography></AccordionDetails>
            </Accordion>
          ))}
        </Container>

        <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: 'primary.dark', color: 'white' }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>Pronto para participar?</Typography>
            <Typography sx={{ mt: 2, color: alpha('#fff', 0.75) }}>Escolha seu perfil e comece a contribuir com o cuidado da cidade.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Button component={Link} to="/register/pessoa-fisica" variant="contained" color="secondary" endIcon={<ArrowForward />}>Cadastrar como morador</Button>
              <Button component={Link} to="/register?tipo=empresa" variant="outlined" sx={{ color: 'white', borderColor: alpha('#fff', 0.5) }}>Cadastrar empresa</Button>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PublicGuide;
