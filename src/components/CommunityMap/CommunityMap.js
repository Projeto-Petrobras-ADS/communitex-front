// /src/components/CommunityMap/CommunityMap.js
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import useUserLocation from '../../hooks/useUserLocation';
import useIssuesMap from '../../hooks/useIssuesMap';
import IssueService from '../../services/IssueService';
import IssueFormModal from './IssueFormModal';
import IssueCard from './IssueCard';
import HeatLayer from './HeatLayer';
import { filterMapIssues, issuesToHeatPoints, PERIOD_OPTIONS } from './issueMapFilters';
import { ISSUE_TYPES } from '../../constants/issueTypes';
import { ISSUE_STATUS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Fab,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Backdrop,
} from '@mui/material';
import {
  Add as AddIcon,
  MyLocation as MyLocationIcon,
  Refresh as RefreshIcon,
  List as ListIcon,
  TouchApp as TouchAppIcon,
  Report as ReportIcon,
  FilterAlt as FilterIcon,
  Layers as LayersIcon,
  Room as MarkerIcon,
} from '@mui/icons-material';

// Fix para ícones do Leaflet em React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Cria um ícone customizado para o marker
 */
const createCustomIcon = (tipo) => {
  const config = ISSUE_TYPES[tipo] || ISSUE_TYPES.OUTRO;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${config.color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        ${config.icon}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

/**
 * Ícone do usuário
 */
const userIcon = L.divIcon({
  className: 'user-marker',
  html: `
    <div style="
      background: linear-gradient(135deg, #2196f3, #1976d2);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.5);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

/**
 * Componente para capturar cliques no mapa
 */
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });
  return null;
};

/**
 * Componente para recentrar o mapa quando a posição mudar
 */
const RecenterMap = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  
  return null;
};

/**
 * Componente para atualizar o centro do mapa quando o usuário move
 */
const MapCenterTracker = ({ onCenterChange }) => {
  const map = useMap();
  
  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    }
  });
  
  return null;
};

/**
 * Componente principal do mapa comunitário
 */
const CommunityMap = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreateIssue = user?.roles?.some((role) => role === 'ROLE_USER' || role === 'ROLE_ADMIN');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedIssueCard, setSelectedIssueCard] = useState(null);
  const [showLocationError, setShowLocationError] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [viewMode, setViewMode] = useState('markers');
  const [filters, setFilters] = useState({ type: '', status: '', period: 'all' });

  const { position: userPosition, error: locationError, isLoading: locationLoading } = useUserLocation();
  
  const { 
    issues, 
    isLoading: issuesLoading, 
    error: issuesError,
    warning: issuesWarning,
    refetch: refetchIssues,
    addInteraction 
  } = useIssuesMap(mapCenter || userPosition, 5000);

  // Lê parâmetros da URL para centralizar no mapa e abrir issue
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const issueId = searchParams.get('issueId');

    if (lat && lng) {
      const urlPosition = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      setMapCenter(urlPosition);
    }

    // Se tiver issueId, busca e abre o card da issue
    if (issueId && !initialLoadDone) {
      const fetchAndOpenIssue = async () => {
        try {
          const response = await IssueService.findByIdWithDetails(parseInt(issueId));
          setSelectedIssueCard(response.data);
        } catch (err) {
          console.error('Erro ao buscar issue:', err);
        }
      };
      fetchAndOpenIssue();
      setInitialLoadDone(true);
      
      // Limpa os parâmetros da URL após usar
      searchParams.delete('issueId');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, initialLoadDone]);

  // Atualiza o centro do mapa quando a posição do usuário é obtida (se não veio da URL)
  useEffect(() => {
    if (userPosition && !mapCenter) {
      setMapCenter(userPosition);
    }
  }, [userPosition, mapCenter]);

  // Mostra erro de localização temporariamente
  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
      const timer = setTimeout(() => setShowLocationError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [locationError]);

  const handleMapClick = useCallback((latlng) => {
    if (!canCreateIssue) return;

    setClickedPosition({
      lat: latlng.lat,
      lng: latlng.lng
    });
    setIsModalOpen(true);
  }, [canCreateIssue]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setClickedPosition(null);
  }, []);

  const handleIssueCreated = useCallback(() => {
    refetchIssues();
  }, [refetchIssues]);

  const handleMarkerClick = useCallback(async (issue) => {
    // Busca detalhes completos da denúncia incluindo interações
    try {
      const response = await IssueService.findByIdWithDetails(issue.id);
      setSelectedIssueCard(response.data);
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      setSelectedIssueCard(issue);
    }
  }, []);

  const handleCloseIssueCard = useCallback(() => {
    setSelectedIssueCard(null);
  }, []);

  const handleSupport = useCallback(async (issueId, tipo, conteudo = null) => {
    const result = await addInteraction(issueId, tipo, conteudo);
    
    // Atualiza o card selecionado após interação bem-sucedida
    if (result.success && selectedIssueCard?.id === issueId) {
      try {
        const response = await IssueService.findByIdWithDetails(issueId);
        setSelectedIssueCard(response.data);
      } catch (err) {
        console.error('Erro ao atualizar detalhes:', err);
      }
    }
    
    return result;
  }, [addInteraction, selectedIssueCard?.id]);

  const handleCenterChange = useCallback((center) => {
    setMapCenter(center);
  }, []);

  const recenterOnUser = useCallback(() => {
    if (userPosition) {
      setMapCenter({ ...userPosition });
    }
  }, [userPosition]);

  const filteredIssues = useMemo(() => filterMapIssues(issues, filters), [issues, filters]);
  const heatPoints = useMemo(() => issuesToHeatPoints(filteredIssues), [filteredIssues]);
  const hasActiveFilters = Boolean(filters.type || filters.status || filters.period !== 'all');
  const updateFilter = (name) => (event) => setFilters((current) => ({ ...current, [name]: event.target.value }));
  const clearFilters = () => setFilters({ type: '', status: '', period: 'all' });

  // Memoiza os marcadores para evitar re-renders
  const issueMarkers = useMemo(() => {
    return filteredIssues.map((issue) => (
      <Marker
        key={issue.id}
        position={[issue.latitude, issue.longitude]}
        icon={createCustomIcon(issue.tipo)}
        eventHandlers={{
          click: () => handleMarkerClick(issue)
        }}
      />
    ));
  }, [filteredIssues, handleMarkerClick]);

  // Loading state
  if (locationLoading) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6">Obtendo sua localização...</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Permita o acesso à localização para uma melhor experiência
        </Typography>
      </Box>
    );
  }

  const initialPosition = userPosition || { lat: -26.3045, lng: -48.8487 };

  return (
    <Box
      sx={{
        position: 'relative',
        height: 'calc(100vh - 64px)',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Notificações de erro */}
      {showLocationError && locationError && (
        <Alert
          severity="warning"
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100,
            maxWidth: 'calc(100% - 32px)',
            boxShadow: 3,
          }}
          onClose={() => setShowLocationError(false)}
        >
          {locationError}
        </Alert>
      )}

      {issuesError && (
        <Alert
          severity="error"
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100,
            maxWidth: 'calc(100% - 32px)',
            boxShadow: 3,
          }}
          action={
            <Button color="inherit" size="small" onClick={refetchIssues}>
              Tentar novamente
            </Button>
          }
        >
          {issuesError}
        </Alert>
      )}

      {issuesWarning && !issuesError && (
        <Alert
          severity="warning"
          sx={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100,
            maxWidth: 'calc(100% - 32px)',
            boxShadow: 3,
          }}
        >
          {issuesWarning}
        </Alert>
      )}

      {/* Mapa */}
      <MapContainer
        center={[initialPosition.lat, initialPosition.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {canCreateIssue && <MapClickHandler onMapClick={handleMapClick} />}
        <MapCenterTracker onCenterChange={handleCenterChange} />
        <RecenterMap position={mapCenter} />

        {/* Marcador do usuário */}
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
            <Popup>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                📍 Você está aqui
              </Typography>
            </Popup>
          </Marker>
        )}

        {viewMode === 'markers' ? issueMarkers : <HeatLayer points={heatPoints} />}
      </MapContainer>

      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          width: { xs: 'calc(100% - 32px)', sm: 300 },
          p: 2,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.96),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack spacing={1.5}>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={viewMode}
            onChange={(_, nextMode) => nextMode && setViewMode(nextMode)}
          >
            <ToggleButton value="markers"><MarkerIcon fontSize="small" sx={{ mr: 0.5 }} /> Marcadores</ToggleButton>
            <ToggleButton value="heat"><LayersIcon fontSize="small" sx={{ mr: 0.5 }} /> Calor</ToggleButton>
          </ToggleButtonGroup>
          <Stack direction="row" spacing={1}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select value={filters.type} label="Tipo" onChange={updateFilter('type')}>
                <MenuItem value="">Todos</MenuItem>
                {Object.entries(ISSUE_TYPES).map(([key, config]) => <MenuItem key={key} value={key}>{config.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={filters.status} label="Status" onChange={updateFilter('status')}>
                <MenuItem value="">Todos</MenuItem>
                {Object.entries(ISSUE_STATUS).map(([key, config]) => <MenuItem key={key} value={key}>{config.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
          <FormControl fullWidth size="small">
            <InputLabel>Período</InputLabel>
            <Select value={filters.period} label="Período" onChange={updateFilter('period')}>
              {PERIOD_OPTIONS.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </Select>
          </FormControl>
          {hasActiveFilters && <Button size="small" startIcon={<FilterIcon />} onClick={clearFilters}>Limpar filtros</Button>}
          {viewMode === 'heat' && (
            <Box>
              <Box sx={{ height: 8, borderRadius: 1, background: 'linear-gradient(90deg, #2c7bb6, #abd9e9, #ffffbf, #fdae61, #d7191c)' }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">Baixa concentração</Typography>
                <Typography variant="caption" color="text.secondary">Alta concentração</Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>

      {filteredIssues.length === 0 && (
        <Alert severity="info" sx={{ position: 'absolute', top: { xs: 288, sm: 16 }, left: 16, zIndex: 1000 }}>
          Nenhuma denúncia encontrada com os filtros selecionados.
        </Alert>
      )}

      {/* Controles do mapa */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 160,
          right: 16,
          zIndex: 1000,
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton
          onClick={() => navigate('/denuncias/lista')}
          title="Ver lista de denúncias"
          sx={{
            borderRadius: 0,
            p: 1.5,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ListIcon />
        </IconButton>
        <IconButton
          onClick={recenterOnUser}
          title="Centralizar na minha localização"
          sx={{
            borderRadius: 0,
            p: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <MyLocationIcon />
        </IconButton>
        <IconButton
          onClick={refetchIssues}
          title="Atualizar denúncias"
          disabled={issuesLoading}
          sx={{
            borderRadius: 0,
            p: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          {issuesLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Paper>

      {/* Botão flutuante para nova denúncia */}
      {canCreateIssue && <Fab
        variant="extended"
        color="primary"
        onClick={() => {
          if (mapCenter) {
            setClickedPosition(mapCenter);
            setIsModalOpen(true);
          }
        }}
        sx={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          px: 3,
          gap: 1,
          boxShadow: 4,
        }}
      >
        <AddIcon />
        Denunciar
      </Fab>}

      {/* Legenda/Info */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          px: 2.5,
          py: 1.5,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          maxWidth: 'calc(100% - 32px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
          <TouchAppIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="text.secondary">
            {canCreateIssue
              ? 'Toque no mapa para denunciar'
              : 'Selecione um marcador para acompanhar ou assumir o reparo'}
          </Typography>
        </Box>
        <Chip
          icon={<ReportIcon />}
          label={`${filteredIssues.length} denúncia${filteredIssues.length !== 1 ? 's' : ''} na região de 5 km`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Paper>

      {/* Modal de formulário */}
      {canCreateIssue && <IssueFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleIssueCreated}
        latitude={clickedPosition?.lat}
        longitude={clickedPosition?.lng}
      />}

      {/* Card de detalhes da denúncia */}
      {selectedIssueCard && (
        <Backdrop
          open={true}
          onClick={handleCloseIssueCard}
          sx={{
            zIndex: 1200,
            alignItems: 'flex-end',
            p: 2,
          }}
        >
          <Paper
            elevation={6}
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: '100%',
              maxWidth: 500,
              maxHeight: '80vh',
              overflow: 'auto',
              borderRadius: 3,
              position: 'relative',
            }}
          >
            <IssueCard
              issue={selectedIssueCard}
              onClose={handleCloseIssueCard}
              onSupport={handleSupport}
              onRepairChanged={async () => {
                refetchIssues();
                const response = await IssueService.findByIdWithDetails(selectedIssueCard.id);
                setSelectedIssueCard(response.data);
              }}
            />
          </Paper>
        </Backdrop>
      )}
    </Box>
  );
};

export default CommunityMap;
