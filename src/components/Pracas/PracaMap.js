import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, useMap, useMapEvents } from 'react-leaflet';
import { Alert, Box, Button, ButtonGroup, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { DeleteOutline, LocationSearching, Search, Undo } from '@mui/icons-material';
import GeocodingService from '../../services/GeocodingService';
import { geoJsonToPoints, pointsToGeoJson, polygonArea, polygonCenter } from './pracaGeometry';
import 'leaflet/dist/leaflet.css';

const BRAZIL_CENTER = [-14.235, -51.9253];

const MapController = ({ target, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds?.length >= 3) map.fitBounds(bounds, { padding: [24, 24] });
    else if (target) map.flyTo(target, 17);
  }, [map, target, bounds]);
  return null;
};

const ClickHandler = ({ enabled, onClick }) => {
  useMapEvents({ click: enabled ? (event) => onClick(event.latlng) : undefined });
  return null;
};

const PracaMap = ({ editable = false, mode = 'point', onModeChange, latitude, longitude, polygon, onChange }) => {
  const [vertices, setVertices] = useState(() => geoJsonToPoints(polygon));
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [mapTarget, setMapTarget] = useState(null);

  const polygonPositions = useMemo(() => vertices.map(({ lat, lng }) => [lat, lng]), [vertices]);
  const hasPoint = latitude !== '' && latitude != null && longitude !== '' && longitude != null;
  const point = hasPoint ? [Number(latitude), Number(longitude)] : null;

  const emitVertices = (nextVertices) => {
    setVertices(nextVertices);
    const nextPolygon = pointsToGeoJson(nextVertices);
    const center = polygonCenter(nextVertices);
    onChange?.({
      polygon: nextPolygon,
      latitude: center?.lat ?? null,
      longitude: center?.lng ?? null,
      metragemM2: nextPolygon ? polygonArea(nextVertices) : null,
    });
  };

  const handleMapClick = (latlng) => {
    setMapTarget(null);
    if (mode === 'polygon') emitVertices([...vertices, { lat: latlng.lat, lng: latlng.lng }]);
    else onChange?.({ polygon: null, latitude: latlng.lat, longitude: latlng.lng, metragemM2: null });
  };

  const findAddress = async () => {
    if (search.trim().length < 3) return;
    try {
      setSearching(true);
      setError('');
      setResults(await GeocodingService.buscar(search.trim()));
    } catch {
      setError('Nao foi possivel buscar o endereco agora.');
    } finally {
      setSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalizacao nao disponivel neste navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setMapTarget([coords.latitude, coords.longitude]),
      () => setError('Nao foi possivel obter sua localizacao.')
    );
  };

  const selectMode = (nextMode) => {
    if (nextMode === 'point') emitVertices([]);
    else onChange?.({ polygon: null, latitude: null, longitude: null, metragemM2: null });
    onModeChange?.(nextMode);
  };

  return (
    <Stack spacing={2}>
      {editable && (
        <>
          <ButtonGroup fullWidth>
            <Button variant={mode === 'point' ? 'contained' : 'outlined'} onClick={() => selectMode('point')}>Marcar ponto</Button>
            <Button variant={mode === 'polygon' ? 'contained' : 'outlined'} onClick={() => selectMode('polygon')}>Desenhar area</Button>
          </ButtonGroup>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              fullWidth
              size="small"
              label="Buscar endereco ou cidade"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), findAddress())}
            />
            <Button variant="outlined" onClick={findAddress} startIcon={searching ? <CircularProgress size={16} /> : <Search />}>Buscar</Button>
            <Button variant="outlined" onClick={useCurrentLocation} startIcon={<LocationSearching />}>Minha localizacao</Button>
          </Stack>
          {results.length > 0 && (
            <Paper variant="outlined">
              {results.map((result) => (
                <Button
                  key={result.place_id}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => {
                    setMapTarget([Number(result.lat), Number(result.lon)]);
                    setResults([]);
                  }}
                >
                  {result.display_name}
                </Button>
              ))}
            </Paper>
          )}
          <Typography variant="body2" color="text.secondary">
            {mode === 'polygon' ? 'Clique no mapa para adicionar os vertices do contorno da praca.' : 'Clique no mapa para marcar a localizacao da praca.'}
          </Typography>
          {mode === 'polygon' && (
            <Stack direction="row" spacing={1}>
              <Button disabled={!vertices.length} onClick={() => emitVertices(vertices.slice(0, -1))} startIcon={<Undo />}>Desfazer vertice</Button>
              <Button disabled={!vertices.length} color="error" onClick={() => emitVertices([])} startIcon={<DeleteOutline />}>Limpar desenho</Button>
            </Stack>
          )}
          {mode === 'point' && (
            <Button
              disabled={!point}
              color="error"
              onClick={() => onChange?.({ polygon: null, latitude: null, longitude: null, metragemM2: null })}
              startIcon={<DeleteOutline />}
            >
              Limpar ponto
            </Button>
          )}
        </>
      )}
      {error && <Alert severity="warning">{error}</Alert>}
      {!editable && !point && polygonPositions.length < 3 ? (
        <Alert severity="info">Esta praca ainda nao possui localizacao cadastrada.</Alert>
      ) : (
        <Box sx={{ height: { xs: 360, md: 440 }, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          <MapContainer center={point || BRAZIL_CENTER} zoom={point ? 17 : 4} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <ClickHandler enabled={editable} onClick={handleMapClick} />
            <MapController target={mapTarget || point} bounds={polygonPositions} />
            {polygonPositions.length >= 3 && <Polygon positions={polygonPositions} pathOptions={{ color: '#2d6a4f', fillOpacity: 0.28 }} />}
            {point && polygonPositions.length < 3 && <CircleMarker center={point} radius={9} pathOptions={{ color: '#2d6a4f', fillOpacity: 0.8 }} />}
            {editable && mode === 'polygon' && vertices.map((vertex, index) => (
              <CircleMarker key={`${vertex.lat}-${vertex.lng}-${index}`} center={[vertex.lat, vertex.lng]} radius={5} pathOptions={{ color: '#1b4332', fillOpacity: 1 }} />
            ))}
          </MapContainer>
        </Box>
      )}
    </Stack>
  );
};

export default PracaMap;
