import { lightColors, darkColors } from './colors';

export const themes = {
  light: lightColors,
  dark: darkColors,
};

export type ThemeMode = 'system' | 'light' | 'dark';

export * from './service';
