import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PracaService from '../../services/PracaService';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';

// Constantes centralizadas
import { PRACA_STATUS, getPracaStatusConfig } from '../../constants';

import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Typography,
  Button,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Park as ParkIcon,
  LocationOn as LocationIcon,
  LocationCity as CityIcon,
  SquareFoot as SquareFootIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Handshake as HandshakeIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  Block as BlockIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

// Ícones para status (usado apenas internamente)
const STATUS_ICONS = {
  DISPONIVEL: <CheckCircleIcon />,
  EM_PROCESSO: <HourglassIcon />,
  ADOTADA: <BlockIcon />,
};

const PracaCard = ({ praca, isEmpresa, onClick }) => {
  const theme = useTheme();
  const statusConfig = getPracaStatusConfig(praca.status);
  const statusIcon = STATUS_ICONS[praca.status];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        borderLeft: '4px solid',
        borderLeftColor: praca.status === 'DISPONIVEL'
          ? 'success.main'
          : praca.status === 'EM_PROCESSO'
          ? 'warning.main'
          : 'text.disabled',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={() => onClick(praca)} sx={{ flexGrow: 1 }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header com ícone e status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: 'primary.main',
                width: 44,
                height: 44,
              }}
            >
              <ParkIcon />
            </Avatar>
            <Chip
              icon={statusIcon}
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Nome */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
            {praca.nome}
          </Typography>

          {/* Localização */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <LocationIcon fontSize="small" />
            {praca.logradouro || praca.bairro || 'Localização não especificada'}
          </Typography>

          {/* Info cards */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexGrow: 1 }}>
            <Chip
              icon={<CityIcon />}
              label={praca.cidade || 'N/D'}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<SquareFootIcon />}
              label={praca.metragemM2 ? `${praca.metragemM2} m²` : 'N/D'}
              size="small"
              variant="outlined"
            />
          </Stack>

          {/* Action */}
          <Chip
            icon={<ViewIcon />}
            label="Ver Detalhes"
            size="small"
            color="primary"
            clickable
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const PracaList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [pracas, setPracas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchNome, setSearchNome] = useState('');
  const [searchCidade, setSearchCidade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { user } = useAuth(); 

  const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');
  const isEmpresa = user && user.roles && user.roles.includes('ROLE_EMPRESA');
  const isUser = user && user.roles && user.roles.includes('ROLE_USER');
  
  const fetchPracas = async (nome = '', cidade = '') => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      const params = new URLSearchParams();
      if (nome) params.append('nome', nome);
      if (cidade) params.append('cidade', cidade);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/api/pracas?${queryString}` : '/api/pracas';
      const response = await api.get(endpoint);
      setPracas(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar praças:", err);
      setError('Não foi possível carregar as praças.');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    fetchPracas();
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      const nomeLength = searchNome.trim().length;
      const cidadeLength = searchCidade.trim().length;
      
      if (nomeLength >= 3 || cidadeLength >= 3) {
        fetchPracas(searchNome, searchCidade);
      } else if (nomeLength === 0 && cidadeLength === 0) {
        fetchPracas('', '');
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [searchNome, searchCidade]);

  const handleClearFilters = () => {
    setSearchNome('');
    setSearchCidade('');
    setFilterStatus('');
  };

  const handlePracaClick = (praca) => {
    navigate(`/pracas/${praca.id}`);
  };

  // Aplica filtro de status localmente
  const filteredPracas = filterStatus 
    ? pracas.filter(p => p.status === filterStatus)
    : pracas;

  const hasActiveFilters = searchNome || searchCidade || filterStatus;
  
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={50} color="primary" />
        <Typography color="text.secondary">Carregando praças...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ParkIcon />
              <Typography variant="h5" fontWeight={700}>
                {isAdmin ? 'Gestão de Praças' : isUser ? 'Praças da Comunidade' : 'Praças Disponíveis'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {pracas.length} praça{pracas.length !== 1 ? 's' : ''} cadastrada{pracas.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {isEmpresa && (
              <Button
                component={Link}
                to="/minhas-propostas"
                variant="outlined"
                startIcon={<AssignmentIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Minhas Adoções
              </Button>
            )}
            {(isAdmin || isUser) && (
              <Button
                component={Link}
                to={isAdmin ? '/admin/pracas/nova' : '/user/pracas/nova'}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.9),
                  },
                }}
              >
                Nova Praça
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nome..."
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchNome && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchNome('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por cidade..."
              value={searchCidade}
              onChange={(e) => setSearchCidade(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CityIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchCidade && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchCidade('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">Todos os Status</MenuItem>
                {Object.entries(PRACA_STATUS).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {hasActiveFilters && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Chip
              icon={<FilterIcon />}
              label={`${filteredPracas.length} resultado${filteredPracas.length !== 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Limpar Filtros
            </Button>
          </Box>
        )}
      </Paper>

      {/* Grid de Praças */}
      {filteredPracas.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Box sx={{ fontSize: '4rem', mb: 2 }}>🏞️</Box>
          <Typography variant="h6" gutterBottom>
            Nenhuma praça encontrada
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {hasActiveFilters 
              ? 'Tente ajustar os filtros para ver mais resultados.'
              : 'Nenhuma praça cadastrada no momento.'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            {hasActiveFilters && (
              <Button variant="outlined" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            )}
            {(isAdmin || isUser) && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to={isAdmin ? '/admin/pracas/nova' : '/user/pracas/nova'}
              >
                Cadastrar Praça
              </Button>
            )}
          </Stack>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredPracas.map((praca) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={praca.id}>
              <PracaCard 
                praca={praca} 
                isEmpresa={isEmpresa}
                onClick={handlePracaClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* FAB para nova praça */}
      {(isAdmin || isUser) && (
        <Fab
          color="primary"
          component={Link}
          to={isAdmin ? '/admin/pracas/nova' : '/user/pracas/nova'}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            boxShadow: 4,
            zIndex: (theme) => theme.zIndex.speedDial,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default PracaList;