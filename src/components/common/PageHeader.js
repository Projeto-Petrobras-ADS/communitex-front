/**
 * PageHeader - Componente de header reutilizável com gradiente sustentável
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  backLink,
  backLabel = 'Voltar',
  actions,
  chip,
  children,
}) => {
  const theme = useTheme();
  const renderedIcon = React.isValidElement(Icon) ? Icon : Icon ? React.createElement(Icon, { sx: { fontSize: 32 } }) : null;

  return (
    <Paper
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 3 },
        borderRadius: 3,
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: alpha('#fff', 0.05),
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {backLink && (
          <Button
            component={Link}
            to={backLink}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: 'white',
              mb: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: alpha('#fff', 0.12) },
            }}
          >
            {backLabel}
          </Button>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { md: 'center' },
            gap: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {Icon && (
              <Avatar sx={{ bgcolor: alpha('#fff', 0.18), width: 60, height: 60 }}>
                {renderedIcon}
              </Avatar>
            )}
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body1" sx={{ opacity: 0.85, mt: 0.25 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>

          {actions && <Stack direction="row" spacing={2}>{actions}</Stack>}
          {chip}
        </Box>

        {children}
      </Box>
    </Paper>
  );
};

export default PageHeader;
