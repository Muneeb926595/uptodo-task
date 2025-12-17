export const lightColors = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#1E90FF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  white: '#FFFFFF',
  black: '#000000',
  muted: '#6B7280',
  brand: {
    DEFAULT: '#5A13ED',
    50: '#1877F2', //facebook blue
    100: '#3382FF',
    200: '#996200',
    300: '#c1963b',
    400: '#f3e675',
    500: '#997EFF', //light version
    600: '#F6F4FC', //lightest version for backgrounds
    700: '#6627E6',
    800: '#8562D1',
  },
  surface: {
    DEFAULT: '#1E2E0D',
    50: '#C2E1C2',
    100: '#1E2E0D',
    300: '#F9F9F9', //light gray background
    400: '#F9FAFB', //light gray background for dropdown
    500: '#DFDFDF', //mid gray for prgoress bar
    600: '#EDEDED', //between mid and light gray for prgoress bar
  },
  typography: {
    DEFAULT: '#344054',
    50: '#0B0B0B',
    100: '#959991',
    200: '#EBECE9',
    300: '#f2f2f2',
    400: '#A1A1A1',
    500: '#168756',
    600: '#798084',
  },
  borders: {
    DEFAULT: '#D4D5D6',
    50: '#D4D5D6',
    100: '#F2F4F7',
    200: '#F4F4F5',
  },
  action: {
    DEFAULT: '#00B03C', //green
    50: '#00B03C', //green
    100: '#FD0303', //red
    200: '#26CFA2', //dard green
    300: '#A1824A', //yellow
    400: '#F5F0E5', //light yellow
    500: '#FED001',
    600: '#DFF2EB', //light green
    700: '#ff9f42',
  },
};

export const darkColors = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#1E90FF',
  card: '#1A1A1A',
  border: '#222222',
  white: '#FFFFFF',
  black: '#000000',
  muted: '#9CA3AF',
  brand: {
    DEFAULT: '#5A13ED',
    50: '#1877F2', //facebook blue
    100: '#3382FF',
    200: '#996200',
    300: '#c1963b',
    400: '#f3e675',
    500: '#997EFF', //light version
    600: '#F6F4FC', //lightest version for backgrounds
    700: '#6627E6',
    800: '#8562D1',
  },
  surface: {
    DEFAULT: '#1E2E0D',
    50: '#C2E1C2',
    100: '#1E2E0D',
    300: '#F9F9F9', //light gray background
    400: '#F9FAFB', //light gray background for dropdown
    500: '#DFDFDF', //mid gray for prgoress bar
    600: '#EDEDED', //between mid and light gray for prgoress bar
  },
  typography: {
    DEFAULT: '#344054',
    50: '#0B0B0B',
    100: '#959991',
    200: '#EBECE9',
    300: '#f2f2f2',
    400: '#A1A1A1',
    500: '#168756',
    600: '#798084',
  },
  borders: {
    DEFAULT: '#D4D5D6',
    50: '#D4D5D6',
    100: '#F2F4F7',
    200: '#F4F4F5',
  },
  action: {
    DEFAULT: '#00B03C', //green
    50: '#00B03C', //green
    100: '#FD0303', //red
    200: '#26CFA2', //dard green
    300: '#A1824A', //yellow
    400: '#F5F0E5', //light yellow
    500: '#FED001',
    600: '#DFF2EB', //light green
    700: '#ff9f42',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
};

export const typography = {
  h1: 28,
  h2: 22,
  body: 16,
  small: 12,
};

export type ThemeColors = typeof lightColors;
export type ThemeSpacing = typeof spacing;
export type ThemeRadii = typeof radii;
export type ThemeTypography = typeof typography;
