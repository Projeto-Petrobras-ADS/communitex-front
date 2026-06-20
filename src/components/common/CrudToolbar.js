import React from 'react';
import { Box, Button, Chip, Paper, Stack } from '@mui/material';
import { Clear as ClearIcon, FilterList as FilterIcon } from '@mui/icons-material';

const CrudToolbar = ({ children, resultCount, hasActiveFilters, onClear, actions }) => (
  <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'center' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      {actions && <Stack direction="row" spacing={1}>{actions}</Stack>}
    </Stack>
    {(hasActiveFilters || resultCount !== undefined) && (
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Chip
          icon={<FilterIcon />}
          label={`${resultCount || 0} resultado${resultCount === 1 ? '' : 's'}`}
          size="small"
          variant="outlined"
        />
        {hasActiveFilters && onClear && (
          <Button size="small" startIcon={<ClearIcon />} onClick={onClear}>Limpar filtros</Button>
        )}
      </Stack>
    )}
  </Paper>
);

export default CrudToolbar;
