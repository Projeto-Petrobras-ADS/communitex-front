export const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todo o período' },
  { value: '7', label: 'Últimos 7 dias' },
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 90 dias' },
];

export const filterMapIssues = (issues, filters, now = new Date()) => {
  const minimumDate = filters.period === 'all'
    ? null
    : new Date(now.getTime() - Number(filters.period) * 24 * 60 * 60 * 1000);

  return issues.filter((issue) => {
    if (filters.type && issue.tipo !== filters.type) return false;
    if (filters.status && issue.status !== filters.status) return false;
    if (minimumDate) {
      const creationDate = issue.dataCriacao ? new Date(issue.dataCriacao) : null;
      if (!creationDate || Number.isNaN(creationDate.getTime()) || creationDate < minimumDate) return false;
    }
    return issue.latitude !== null && issue.latitude !== ''
      && issue.longitude !== null && issue.longitude !== ''
      && Number.isFinite(Number(issue.latitude))
      && Number.isFinite(Number(issue.longitude));
  });
};

export const issuesToHeatPoints = (issues) => (
  issues.map((issue) => [Number(issue.latitude), Number(issue.longitude), 1])
);
