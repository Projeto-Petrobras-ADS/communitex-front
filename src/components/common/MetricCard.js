import React from 'react';
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';

const MetricCard = ({ label, value, icon: Icon, color = 'primary', helper, onClick }) => {
  const content = (
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <div>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="h4" sx={{ mt: 0.5 }}>{value}</Typography>
          {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
        </div>
        {Icon && (
          <Avatar variant="rounded" sx={{ bgcolor: `${color}.light`, color: `${color}.dark` }}>
            <Icon fontSize="small" />
          </Avatar>
        )}
      </Stack>
    </CardContent>
  );

  return (
  <Card variant="outlined" sx={{ height: '100%' }}>
    {onClick ? <CardActionArea onClick={onClick} sx={{ height: '100%' }}>{content}</CardActionArea> : content}
  </Card>
  );
};

export default MetricCard;
