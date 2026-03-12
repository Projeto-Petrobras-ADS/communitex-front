/**
 * LoadingState - Componente de estado de carregamento
 */
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = ({
  message = 'Carregando...',
  fullHeight = true,
  size = 48,
}) => {
  return (
    <Box
      sx={{
        minHeight: fullHeight ? '60vh' : 'auto',
        py: fullHeight ? 0 : 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={size} color="primary" thickness={4} />
      {message && (
        <Typography sx={{ mt: 2 }} color="text.secondary" fontWeight={500}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingState;
