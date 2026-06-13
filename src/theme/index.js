/**
 * Tema MUI centralizado da aplicação Communitex
 * @description Configuração do tema Material-UI com paleta sustentável (natureza, verde floresta, terra)
 */
import { createTheme, alpha } from '@mui/material/styles';

// --- Paleta Comunitária e Urbana ---
const PRIMARY = {
  lighter: '#e7f0ff',
  light:   '#8ab4f8',
  main:    '#2563a9',
  dark:    '#173f73',
  contrastText: '#ffffff',
};

const SECONDARY = {
  light: '#8fd5c2',
  main:  '#27856f',
  dark:  '#17604f',
  contrastText: '#ffffff',
};

// --- Gradiente principal ---
export const GRADIENT_PRIMARY = `linear-gradient(135deg, ${PRIMARY.dark} 0%, ${PRIMARY.main} 60%, ${PRIMARY.light} 100%)`;

// Criação do tema
const theme = createTheme({
  palette: {
    primary: PRIMARY,
    secondary: SECONDARY,
    error: {
      main: '#c1121f',
      light: '#ffcdd2',
    },
    warning: {
      main: '#d5a63c',
      dark: '#9e7419',
    },
    success: {
      main: '#4f8a5b',
      light: '#cfe4d3',
    },
    info: {
      main: '#4387a1',
      light: '#d5e9f0',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1d2939',
      secondary: '#667085',
    },
    divider: '#e4e7ec',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-1.5px' },
    h2: { fontWeight: 800, letterSpacing: '-1px' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.4px' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(27,67,50,0.08)',
    '0 2px 6px rgba(27,67,50,0.10)',
    '0 4px 12px rgba(27,67,50,0.10)',
    '0 6px 16px rgba(27,67,50,0.12)',
    '0 8px 20px rgba(27,67,50,0.12)',
    '0 10px 24px rgba(27,67,50,0.14)',
    '0 12px 28px rgba(27,67,50,0.14)',
    '0 14px 32px rgba(27,67,50,0.16)',
    '0 16px 36px rgba(27,67,50,0.16)',
    '0 18px 40px rgba(27,67,50,0.18)',
    '0 20px 44px rgba(27,67,50,0.18)',
    '0 22px 48px rgba(27,67,50,0.20)',
    '0 24px 52px rgba(27,67,50,0.20)',
    '0 26px 56px rgba(27,67,50,0.22)',
    '0 28px 60px rgba(27,67,50,0.22)',
    '0 30px 64px rgba(27,67,50,0.24)',
    '0 32px 68px rgba(27,67,50,0.24)',
    '0 34px 72px rgba(27,67,50,0.26)',
    '0 36px 76px rgba(27,67,50,0.26)',
    '0 38px 80px rgba(27,67,50,0.28)',
    '0 40px 84px rgba(27,67,50,0.28)',
    '0 42px 88px rgba(27,67,50,0.30)',
    '0 44px 92px rgba(27,67,50,0.30)',
    '0 46px 96px rgba(27,67,50,0.32)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${PRIMARY.light} ${PRIMARY.lighter}`,
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: PRIMARY.lighter },
          '&::-webkit-scrollbar-thumb': {
            background: PRIMARY.light,
            borderRadius: 4,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 7,
          minHeight: 38,
        },
        containedPrimary: { boxShadow: 'none' },
        containedSecondary: {
          color: '#1a2e1e',
          boxShadow: `0 4px 14px ${alpha(SECONDARY.main, 0.35)}`,
          '&:hover': {
            boxShadow: `0 6px 20px ${alpha(SECONDARY.main, 0.45)}`,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
          border: '1px solid #e4e7ec',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        rounded: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: `0 4px 14px ${alpha(PRIMARY.main, 0.4)}`,
          '&:hover': {
            boxShadow: `0 6px 20px ${alpha(PRIMARY.main, 0.5)}`,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY.light,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY.main,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f9fafb',
            color: '#475467',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(PRIMARY.main, 0.03),
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 7, minHeight: 40 },
      },
    },
    MuiFocusVisible: {
      styleOverrides: {
        root: {
          outline: `3px solid ${PRIMARY.light}`,
          outlineOffset: 2,
        },
      },
    },
  },
});

// --- Utilitários de estilo exportados ---
export const gradients = {
  primary: GRADIENT_PRIMARY,
  hero: GRADIENT_PRIMARY,
  soft: `linear-gradient(135deg, ${alpha(PRIMARY.dark, 0.9)} 0%, ${alpha(PRIMARY.main, 0.85)} 100%)`,
};

export const shadows = {
  button: `0 8px 20px ${alpha(PRIMARY.main, 0.35)}`,
  buttonHover: `0 12px 30px ${alpha(PRIMARY.main, 0.45)}`,
  card: '0 4px 20px rgba(27,67,50,0.08)',
  cardHover: '0 8px 30px rgba(27,67,50,0.14)',
};

export const inputStyles = {
  rounded: {
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
  },
};

export default theme;
