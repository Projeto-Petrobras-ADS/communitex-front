/**
 * EmptyState - Componente para estados vazios
 */
import React from 'react';
import { Paper, Typography, Button, Stack, Avatar, useTheme, alpha } from '@mui/material';
import { Nature as NatureIcon } from '@mui/icons-material';

const EmptyState = ({
  icon: Icon = NatureIcon,
  title = 'Nenhum item encontrado',
  description,
  actionLabel,
  actionIcon,
  onAction,
  actionComponent,
}) => {
  const theme = useTheme();
  const renderedIcon = React.isValidElement(Icon)
    ? Icon
    : Icon
      ? React.createElement(Icon, { sx: { fontSize: 40 } })
      : null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 3,
        border: '2px dashed',
        borderColor: alpha(theme.palette.primary.main, 0.25),
        bgcolor: alpha(theme.palette.primary.main, 0.03),
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          mx: 'auto',
          mb: 3,
        }}
      >
        {renderedIcon}
      </Avatar>

      <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: 'auto' }}>
          {description}
        </Typography>
      )}

      <Stack direction="row" spacing={2} justifyContent="center">
        {actionComponent}
        {actionLabel && onAction && (
          <Button
            variant="contained"
            startIcon={actionIcon}
            onClick={onAction}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default EmptyState;
