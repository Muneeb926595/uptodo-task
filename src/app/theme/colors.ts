export const lightColors = {
  background: '#121212', // App background
  text: '#EDEDED', // Primary text
  primary: '#8687E7', // Main CTA buttons
  card: '#979797', // List items / cards
  border: '#2C2C2C',
  white: '#FFFFFF',
  black: '#000000',
  muted: '#9CA3AF',
  red: 'red',
  modalBackground: '#000000BD',
  transparent: 'transparent',

  brand: {
    DEFAULT: '#8687E7',
    50: '#F3F1FF',
    100: '#E6E2FF',
    200: '#CFC8FF',
    300: '#B8ADFF',
    400: '#A193FF',
    500: '#8687E7',
    600: '#6F63E6',
    700: '#554BCC',
    800: '#3D35B3',
  },

  surface: {
    DEFAULT: '#363636', // Cards / sheets
    50: '#272727', // Inputs
    100: '#363636',
    300: '#1C1C1C',
    400: '#181818',
    500: '#141414',
    600: '#0F0F0F',
  },

  typography: {
    DEFAULT: '#EDEDED',
    50: '#FFFFFF',
    100: '#E5E7EB',
    200: '#D1D5DB',
    300: '#9CA3AF',
    400: '#6B7280',
    500: '#4B5563',
    600: '#374151',
  },

  borders: {
    DEFAULT: '#2C2C2C',
    50: '#3A3A3A',
    100: '#333333',
    200: '#262626',
  },

  action: {
    DEFAULT: '#8687E7',
    50: '#F3F1FF', // Hover bg
    100: '#E6E2FF', // Focus bg
    200: '#CFC8FF', // Selected
    300: '#B8ADFF',
    400: '#A193FF',
    500: '#8687E7', // Active
    600: '#6F63E6',
    700: '#554BCC', // Pressed
  },
};
export const darkColors = {
  background: '#FFFFFF', // App background (inverted)
  text: '#121212', // Primary text
  primary: '#8687E7', // Brand stays consistent
  card: '#F4F4F5', // Light cards
  border: '#E5E7EB',
  white: '#FFFFFF',
  black: '#000000',
  muted: '#6B7280',
  red: 'red',
  transparent: 'transparent',

  brand: {
    DEFAULT: '#8687E7',
    50: '#F3F1FF',
    100: '#E6E2FF',
    200: '#CFC8FF',
    300: '#B8ADFF',
    400: '#A193FF',
    500: '#8687E7',
    600: '#6F63E6',
    700: '#554BCC',
    800: '#3D35B3',
  },

  surface: {
    DEFAULT: '#F4F4F5', // Cards / sheets
    50: '#FFFFFF', // Inputs
    100: '#FAFAFA',
    300: '#F3F4F6',
    400: '#EDEEF0',
    500: '#E5E7EB',
    600: '#D1D5DB',
  },

  typography: {
    DEFAULT: '#121212',
    50: '#0A0A0A',
    100: '#1F2937',
    200: '#374151',
    300: '#4B5563',
    400: '#6B7280',
    500: '#9CA3AF',
    600: '#D1D5DB',
  },

  borders: {
    DEFAULT: '#E5E7EB',
    50: '#F3F4F6',
    100: '#E5E7EB',
    200: '#D1D5DB',
  },

  action: {
    DEFAULT: '#8687E7',
    50: '#F3F1FF',
    100: '#E6E2FF',
    200: '#CFC8FF',
    300: '#B8ADFF',
    400: '#A193FF',
    500: '#8687E7',
    600: '#6F63E6',
    700: '#554BCC',
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
