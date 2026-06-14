import { geoJsonToPoints, pointsToGeoJson, polygonArea, polygonCenter } from './pracaGeometry';

const points = [
  { lat: -27.6, lng: -48.5 },
  { lat: -27.6, lng: -48.499 },
  { lat: -27.599, lng: -48.499 },
  { lat: -27.599, lng: -48.5 },
];

test('converts points to a closed GeoJSON polygon and back', () => {
  const polygon = pointsToGeoJson(points);

  expect(polygon.type).toBe('Polygon');
  expect(polygon.coordinates[0]).toHaveLength(5);
  expect(polygon.coordinates[0][0]).toEqual(polygon.coordinates[0][4]);
  expect(geoJsonToPoints(polygon)).toEqual(points);
});

test('calculates polygon center and approximate area', () => {
  expect(polygonCenter(points)).toEqual(expect.objectContaining({
    lat: expect.closeTo(-27.5995, 5),
    lng: expect.closeTo(-48.4995, 5),
  }));
  expect(polygonArea(points)).toBeGreaterThan(9000);
});

test('does not create polygon with fewer than three vertices', () => {
  expect(pointsToGeoJson(points.slice(0, 2))).toBeNull();
});
