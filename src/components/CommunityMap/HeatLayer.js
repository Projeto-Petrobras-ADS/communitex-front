import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return undefined;

    const layer = L.heatLayer(points, {
      radius: 32,
      blur: 24,
      maxZoom: 17,
      minOpacity: 0.35,
      gradient: {
        0.2: '#2c7bb6',
        0.45: '#abd9e9',
        0.65: '#ffffbf',
        0.82: '#fdae61',
        1: '#d7191c',
      },
    }).addTo(map);

    return () => map.removeLayer(layer);
  }, [map, points]);

  return null;
};

export default HeatLayer;
