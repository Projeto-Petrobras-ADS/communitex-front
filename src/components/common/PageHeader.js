import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Avatar, Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  backLink,
  backLabel = 'Voltar',
  actions,
  chip,
  breadcrumbs = [],
  children,
}) => {
  const renderedIcon = React.isValidElement(Icon)
    ? Icon
    : Icon
      ? React.createElement(Icon, { fontSize: 'small' })
      : null;

  return (
    <Box sx={{ mb: 3 }}>
      {(backLink || breadcrumbs.length > 0) && (
        <Breadcrumbs sx={{ mb: 1.5, color: 'text.secondary' }}>
          <Typography component={Link} to="/pracas" color="inherit" sx={{ textDecoration: 'none' }}>
            Início
          </Typography>
          {breadcrumbs.map((item) => (
            item.to
              ? <Typography key={item.label} component={Link} to={item.to} color="inherit" sx={{ textDecoration: 'none' }}>{item.label}</Typography>
              : <Typography key={item.label} color="text.primary">{item.label}</Typography>
          ))}
        </Breadcrumbs>
      )}

      {backLink && (
        <Button component={Link} to={backLink} startIcon={<ArrowBackIcon />} size="small" sx={{ mb: 1 }}>
          {backLabel}
        </Button>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {renderedIcon && (
            <Avatar variant="rounded" sx={{ bgcolor: 'primary.lighter', color: 'primary.main', width: 42, height: 42 }}>
              {renderedIcon}
            </Avatar>
          )}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h4">{title}</Typography>
              {chip}
            </Stack>
            {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{subtitle}</Typography>}
          </Box>
        </Stack>
        {actions && <Stack direction="row" spacing={1} flexWrap="wrap">{actions}</Stack>}
      </Stack>
      {children}
    </Box>
  );
};

export default PageHeader;
