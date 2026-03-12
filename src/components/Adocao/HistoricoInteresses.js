import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  History as HistoryIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const HistoricoInteresses = ({ interesses, loading = false }) => {
  if (loading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" /> Histórico de Interesses
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!interesses || interesses.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" /> Histórico de Interesses
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              Nenhuma empresa manifestou interesse nesta praça ainda.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon color="primary" /> Histórico de Interesses
        <Chip label={interesses.length} size="small" color="primary" />
      </Typography>

      <Stack spacing={2}>
        {interesses.map((interesse, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon fontSize="small" color="primary" />
                  {interesse.nomeEmpresa}
                </Typography>
                <Chip label={`ID: ${interesse.empresaId}`} size="small" variant="outlined" />
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Proposta de Adoção:
              </Typography>
              <Typography variant="body2" sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 1 }}>
                {interesse.proposta}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default HistoricoInteresses;
