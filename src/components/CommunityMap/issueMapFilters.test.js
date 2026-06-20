import { filterMapIssues, issuesToHeatPoints } from './issueMapFilters';

const now = new Date('2026-06-14T12:00:00Z');
const issues = [
  { id: 1, tipo: 'LIXO', status: 'ABERTA', dataCriacao: '2026-06-13T12:00:00Z', latitude: -27.1, longitude: -48.1 },
  { id: 2, tipo: 'BURACO', status: 'RESOLVIDA', dataCriacao: '2026-05-20T12:00:00Z', latitude: -27.2, longitude: -48.2 },
  { id: 3, tipo: 'LIXO', status: 'ABERTA', dataCriacao: '2026-01-01T12:00:00Z', latitude: -27.3, longitude: -48.3 },
];

test('filters map issues by type, status and period', () => {
  const result = filterMapIssues(issues, { type: 'LIXO', status: 'ABERTA', period: '30' }, now);
  expect(result.map((issue) => issue.id)).toEqual([1]);
});

test('returns all geographically valid issues with cleared filters', () => {
  const result = filterMapIssues(
    [...issues, { id: 4, latitude: null, longitude: null }],
    { type: '', status: '', period: 'all' },
    now
  );
  expect(result).toHaveLength(3);
});

test('creates uniform heat points', () => {
  expect(issuesToHeatPoints(issues.slice(0, 2))).toEqual([
    [-27.1, -48.1, 1],
    [-27.2, -48.2, 1],
  ]);
});
