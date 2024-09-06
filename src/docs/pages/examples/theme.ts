import type { HoneyTheme } from '../../../types';

const theme: HoneyTheme = {
  breakpoints: {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
  },
  container: {
    maxWidth: '1450px',
  },
  spacings: {
    base: 8,
  },
  fonts: {
    body2: {
      size: 14,
      lineHeight: 16,
      letterSpacing: 0,
    },
  },
  dimensions: {},
  colors: {
    primary: {},
    secondary: {},
    accent: {},
    neutral: {
      charcoalDark: '#231F20',
    },
    success: {},
    warning: {},
    error: {},
  },
};

export default theme;
