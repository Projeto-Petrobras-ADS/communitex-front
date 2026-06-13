// /src/components/CommunityMap/IssueList.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import IssueService from '../../services/IssueService';

// Constantes centralizadas
import { ISSUE_TYPES, ISSUE_STATUS, getIssueTypeConfig, getIssueStatusConfig } from '../../constants';

// Utilitários
import { formatDate } from '../../utils';
import { EmptyState, LoadingState, PageHeader } from '../common';

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Alert,
  Fab,
  useTheme,
  alpha,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Map as MapIcon,
  Clear as ClearIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubble as ChatBubbleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  ReportProblem as ReportIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

/**
 * Componente de Card individual
 */
const IssueListCard = ({ issue, onClick }) => {
  const typeConfig = getIssueTypeConfig(issue.tipo);
  const statusConfig = getIssueStatusConfig(issue.status);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        borderLeft: '4px solid',
        borderLeftColor: typeConfig.color || 'primary.light',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={() => onClick(issue)} sx={{ flexGrow: 1 }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header com tipo e status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: typeConfig.color,
                width: 44,
                height: 44,
                fontSize: '1.5rem',
              }}
            >
              {typeConfig.icon}
            </Avatar>
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Título */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
            {issue.titulo}
          </Typography>

          {/* Descrição */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {issue.descricao}
          </Typography>

          {/* Meta info */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {issue.autorNome || 'Anônimo'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {formatDate(issue.dataCriacao)}
              </Typography>
            </Box>
          </Stack>

          {/* Stats e ação */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1.5}>
              <Chip
                icon={<ThumbUpIcon />}
                label={issue.totalApoios || 0}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<ChatBubbleIcon />}
                label={issue.totalInteracoes || 0}
                size="small"
                variant="outlined"
              />
            </Stack>
            <Chip
              icon={<LocationIcon />}
              label="Ver no Mapa"
              size="small"
              color="primary"
              clickable
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

/**
 * Componente principal de listagem de denúncias
 */
const IssueList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Busca todas as denúncias
  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await IssueService.findAll();
      setIssues(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar denúncias:', err);
      setError('Não foi possível carregar as denúncias. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Filtra e ordena as denúncias
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    // Filtro por texto (título ou descrição)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(issue => 
        issue.titulo?.toLowerCase().includes(term) ||
        issue.descricao?.toLowerCase().includes(term) ||
        issue.autorNome?.toLowerCase().includes(term)
      );
    }

    // Filtro por tipo
    if (filterType) {
      result = result.filter(issue => issue.tipo === filterType);
    }

    // Filtro por status
    if (filterStatus) {
      result = result.filter(issue => issue.status === filterStatus);
    }

    // Ordenação
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
        break;
      case 'mostSupported':
        result.sort((a, b) => (b.totalApoios || 0) - (a.totalApoios || 0));
        break;
      case 'mostCommented':
        result.sort((a, b) => (b.totalInteracoes || 0) - (a.totalInteracoes || 0));
        break;
      default:
        break;
    }

    return result;
  }, [issues, searchTerm, filterType, filterStatus, sortBy]);

  // Navega para o mapa com a issue selecionada
  const handleIssueClick = (issue) => {
    navigate(`/denuncias?lat=${issue.latitude}&lng=${issue.longitude}&issueId=${issue.id}`);
  };

  // Limpa todos os filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setSortBy('recent');
  };

  const hasActiveFilters = searchTerm || filterType || filterStatus || sortBy !== 'recent';

  if (isLoading) {
    return <LoadingState message="Carregando denúncias da comunidade..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchIssues}>
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
      <PageHeader
        title="Denúncias comunitárias"
        subtitle={`${issues.length} ocorrência${issues.length === 1 ? '' : 's'} registrada${issues.length === 1 ? '' : 's'} pela comunidade.`}
        icon={ReportIcon}
        actions={<Button
            variant="contained"
            color="inherit"
            startIcon={<MapIcon />}
            onClick={() => navigate('/denuncias')}
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha('#fff', 0.9),
              },
            }}
          >
            Ver mapa
          </Button>}
      />

      {/* Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por título, descrição ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterType}
                label="Tipo"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">Todos os Tipos</MenuItem>
                {Object.entries(ISSUE_TYPES).map(([key, { icon, label }]) => (
                  <MenuItem key={key} value={key}>
                    {icon} {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">Todos os Status</MenuItem>
                {Object.entries(ISSUE_STATUS).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordenar</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="recent">Mais Recentes</MenuItem>
                <MenuItem value="oldest">Mais Antigas</MenuItem>
                <MenuItem value="mostSupported">Mais Apoiadas</MenuItem>
                <MenuItem value="mostCommented">Mais Comentadas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {hasActiveFilters && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Chip
              icon={<FilterIcon />}
              label={`${filteredIssues.length} resultado${filteredIssues.length !== 1 ? 's' : ''}`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
            >
              Limpar Filtros
            </Button>
          </Box>
        )}
      </Paper>

      {/* Lista de Issues */}
      {filteredIssues.length === 0 ? (
        <EmptyState
          icon={ReportIcon}
          title="Nenhuma denúncia encontrada"
          description={hasActiveFilters ? 'Ajuste os filtros para ampliar os resultados.' : 'Ainda não há ocorrências registradas nesta área.'}
          actionComponent={<Stack direction="row" spacing={2}>
            {hasActiveFilters && <Button variant="outlined" onClick={clearFilters}>Limpar filtros</Button>}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/denuncias')}>Nova denúncia</Button>
          </Stack>}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredIssues.map((issue) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={issue.id}>
              <IssueListCard 
                issue={issue} 
                onClick={handleIssueClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* FAB para nova denúncia */}
      <Fab
        color="primary"
        onClick={() => navigate('/denuncias')}
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
    </Box>
  );
};

export default IssueList;
