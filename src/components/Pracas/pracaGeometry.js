const EARTH_RADIUS_METERS = 6371008.8;

export const closeRing = (points) => {
  if (points.length === 0) return [];
  return [...points, points[0]];
};

export const pointsToGeoJson = (points) => points.length >= 3 ? ({
  type: 'Polygon',
  coordinates: [closeRing(points).map(({ lat, lng }) => [lng, lat])],
}) : null;

export const geoJsonToPoints = (polygon) => {
  const ring = polygon?.type === 'Polygon' ? polygon.coordinates?.[0] : null;
  if (!Array.isArray(ring)) return [];
  return ring.slice(0, -1).map(([lng, lat]) => ({ lat, lng }));
};

export const polygonCenter = (points) => {
  if (points.length < 3) return null;
  const origin = points[0];
  const totals = points.reduce((result, point, index) => {
    const next = points[(index + 1) % points.length];
    const currentLng = point.lng - origin.lng;
    const currentLat = point.lat - origin.lat;
    const nextLng = next.lng - origin.lng;
    const nextLat = next.lat - origin.lat;
    const cross = currentLng * nextLat - nextLng * currentLat;
    return {
      area: result.area + cross,
      lat: result.lat + (currentLat + nextLat) * cross,
      lng: result.lng + (currentLng + nextLng) * cross,
    };
  }, { area: 0, lat: 0, lng: 0 });
  if (Math.abs(totals.area) < 1e-12) return null;
  return {
    lat: origin.lat + totals.lat / (3 * totals.area),
    lng: origin.lng + totals.lng / (3 * totals.area),
  };
};

export const polygonArea = (points) => {
  if (points.length < 3) return 0;
  const meanLatitude = points.reduce((sum, point) => sum + point.lat, 0) / points.length * Math.PI / 180;
  const projected = points.map((point) => ({
    x: EARTH_RADIUS_METERS * point.lng * Math.PI / 180 * Math.cos(meanLatitude),
    y: EARTH_RADIUS_METERS * point.lat * Math.PI / 180,
  }));
  return Math.abs(projected.reduce((sum, point, index) => {
    const next = projected[(index + 1) % projected.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0)) / 2;
};
