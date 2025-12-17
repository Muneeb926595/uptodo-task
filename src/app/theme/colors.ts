export const lightColors = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#1E90FF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  white: '#FFFFFF',
  black: '#000000',
  muted: '#6B7280',
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
