import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const notify = useCallback((message, severity = 'info') => {
    if (!message) return;
    setNotification({ open: true, message, severity });
  }, []);

  const closeNotification = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setNotification((current) => ({ ...current, open: false }));
  }, []);

  const value = useMemo(() => ({
    notify,
    notifySuccess: (message) => notify(message, 'success'),
    notifyError: (message) => notify(message, 'error'),
    notifyWarning: (message) => notify(message, 'warning'),
    notifyInfo: (message) => notify(message, 'info'),
  }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={closeNotification}
          sx={{ width: '100%', minWidth: { sm: 360 } }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser utilizado dentro de NotificationProvider');
  }
  return context;
};
