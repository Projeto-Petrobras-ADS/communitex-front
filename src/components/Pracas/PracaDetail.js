import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PracaService from '../../services/PracaService';
import AdocaoService from '../../services/AdocaoService';
import { resolveApiUrl } from '../../services/api';
import HistoricoInteresses from '../Adocao/HistoricoInteresses';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Park as ParkIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  LocationCity as CityIcon,
  Map as MapIcon,
  SquareFoot as SquareFootIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Handshake as HandshakeIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  Block as BlockIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const PracaDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [praca, setPraca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sucesso] = useState(!!location.state?.successMessage);
  const [propostaExistente, setPropostaExistente] = useState(null);

  const isEmpresa = user && user.roles && user.roles.includes('ROLE_EMPRESA');

  useEffect(() => {
    const fetchPraca = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const data = await PracaService.buscarPracaComDetalhes(id);
          setPraca(data);
        } catch (detailsError) {
          console.warn('Falha ao buscar detalhes, tentando versão simples...');
          const data = await PracaService.buscarPracaSimples(id);
          setPraca(data);
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes da praça:", err);
        setError('Não foi possível carregar os detalhes da praça.');
      } finally {
        setLoading(false);
      }
    };

    fetchPraca();
  }, [id]);

  useEffect(() => {
    if (!isEmpresa) return;
    AdocaoService.listarMinhasPropostas()
      .then((propostas) => setPropostaExistente(propostas.find((proposta) => String(proposta.pracaId) === String(id)) || null))
      .catch(() => setPropostaExistente(null));
  }, [id, isEmpresa]);

  const handleAbrirManifestacao = () => {
    navigate(`/pracas/${id}/manifestar-interesse`, {
      state: { pracaNome: praca.nome }
    });
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'DISPONIVEL':
        return { color: 'success', icon: <CheckCircleIcon />, label: 'Disponível' };
      case 'EM_PROCESSO':
        return { color: 'warning', icon: <HourglassIcon />, label: 'Em Processo' };
      case 'ADOTADA':
        return { color: 'error', icon: <BlockIcon />, label: 'Adotada' };
      default:
        return { color: 'default', icon: null, label: status };
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="primary" size={48} />
          <Typography sx={{ mt: 2 }} color="text.secondary">Carregando detalhes da praça...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !praca) {
    return (
      <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', p: 3 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Button
            component={Link}
            to="/pracas"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 3 }}
          >
            Voltar para a lista
          </Button>
          <Alert severity="error">{error || "Praça não encontrada."}</Alert>
        </Box>
      </Box>
    );
  }

  const isDisponivel = praca.status === 'DISPONIVEL';
  const emProcesso = praca.status === 'EM_PROCESSO';
  const adotada = praca.status === 'ADOTADA';
  const statusConfig = getStatusConfig(praca.status);

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
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Button
            component={Link}
            to="/pracas"
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'white', mb: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Voltar para a lista
          </Button>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                <ParkIcon sx={{ fontSize: 36 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {praca.nome}
                </Typography>
                {praca.logradouro && (
                  <Typography variant="body1" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 18 }} /> {praca.logradouro}
                  </Typography>
                )}
              </Box>
            </Box>

            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                py: 2.5,
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
        {sucesso && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<CheckCircleIcon />}
          >
            <strong>Manifestação enviada com sucesso!</strong> O responsável pela praça receberá sua proposta em breve.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Foto */}
            {praca.fotoUrl && (
              <Card elevation={0} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={resolveApiUrl(praca.fotoUrl)}
                  alt={praca.nome}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            )}

            {/* Informações */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <DescriptionIcon color="primary" /> Informações da Praça
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ParkIcon sx={{ fontSize: 16 }} /> Nome
                      </Typography>
                      <Typography fontWeight={600}>{praca.nome}</Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16 }} /> Localização
                      </Typography>
                      <Typography fontWeight={600}>{praca.logradouro || 'Não informado'}</Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HomeIcon sx={{ fontSize: 16 }} /> Bairro
                      </Typography>
                      <Typography fontWeight={600}>{praca.bairro || 'Não informado'}</Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CityIcon sx={{ fontSize: 16 }} /> Cidade
                      </Typography>
                      <Typography fontWeight={600}>{praca.cidade || 'Não informado'}</Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MapIcon sx={{ fontSize: 16 }} /> Latitude
                      </Typography>
                      <Typography fontWeight={600}>{praca.latitude || 'Não informada'}</Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MapIcon sx={{ fontSize: 16 }} /> Longitude
                      </Typography>
                      <Typography fontWeight={600}>{praca.longitude || 'Não informada'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {praca.metragemM2 && (
                  <Paper
                    sx={{
                      mt: 3,
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <SquareFootIcon sx={{ fontSize: 16 }} /> Metragem
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="primary">
                      {praca.metragemM2} m²
                    </Typography>
                  </Paper>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Descrição
                </Typography>
                <Typography variant="body1">
                  {praca.descricao || 'Nenhuma descrição fornecida.'}
                </Typography>
              </CardContent>
            </Card>

            {/* Responsável */}
            {praca.cadastradoPor && (
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon color="primary" /> Responsável pela Praça
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 36, height: 36 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Nome</Typography>
                        <Typography fontWeight={600}>{praca.cadastradoPor.nome}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 36, height: 36 }}>
                        <EmailIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography fontWeight={600}>{praca.cadastradoPor.email}</Typography>
                      </Box>
                    </Box>

                    {praca.cadastradoPor.telefone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 36, height: 36 }}>
                          <PhoneIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Telefone</Typography>
                          <Typography fontWeight={600}>{praca.cadastradoPor.telefone}</Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar - Action Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 100,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {isDisponivel && isEmpresa ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                        <HandshakeIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700}>
                        Inicie a Adoção
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Sua empresa pode ser a próxima a cuidar deste espaço, melhorando o bairro e ganhando visibilidade.
                    </Typography>
                    <Button
                      onClick={propostaExistente ? () => navigate('/minhas-propostas') : handleAbrirManifestacao}
                      variant="contained"
                      fullWidth
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        boxShadow: '0 8px 20px rgba(45, 106, 79, 0.35)',
                        '&:hover': {
                          boxShadow: '0 12px 30px rgba(45, 106, 79, 0.45)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {propostaExistente ? 'Acompanhar proposta' : 'Manifestar Interesse'}
                    </Button>
                  </>
                ) : emProcesso ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                        <HourglassIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700}>
                        Processo em Andamento
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Esta praça está em processo de adoção. Aguarde a conclusão da análise.
                    </Typography>
                  </>
                ) : adotada ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700}>
                        Praça Adotada
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Esta praça já foi adotada por uma empresa. Conheça outras praças disponíveis!
                    </Typography>
                    <Button
                      component={Link}
                      to="/pracas"
                      variant="outlined"
                      fullWidth
                      startIcon={<ParkIcon />}
                    >
                      Ver todas as praças
                    </Button>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1), color: 'text.secondary' }}>
                        <LockIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700}>
                        Acesso Restrito
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Apenas empresas autenticadas podem manifestar interesse em adotar praças.
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {praca.historicoInteresses && (
          <Box sx={{ mt: 3 }}>
            <HistoricoInteresses
              interesses={praca.historicoInteresses}
              loading={false}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PracaDetail;
