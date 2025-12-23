/**
 * Theme Context - Unistyles Integration with Service Layer
 * Provides theme utilities through the adapter service pattern
 */

import {
  useUnistyles,
  UnistylesRuntime,
  StyleSheet,
} from 'react-native-unistyles';
import { themeService } from './service';

// Re-export types from adapter
export type { ThemeName, ThemeMetadata } from './theme-adapter';

// Re-export service instance
export { themeService };

// Direct re-export of Unistyles hook
export const useTheme = useUnistyles;

// Export StyleSheet for creating styles
export const createStyles = StyleSheet;

// Helper to change theme using service
export const setTheme = async (
  name: Parameters<typeof themeService.setTheme>[0],
) => {
  await themeService.setTheme(name);
};

// Get theme metadata
export const themeMetadata = themeService.getAllThemeMetadata();

// Initialize theme from storage on app start
export const initializeTheme = async () => {
  await themeService.initializeTheme();
};

// Export UnistylesRuntime for advanced usage
export { UnistylesRuntime };

// No-op provider for backwards compatibility
export const ThemeProvider = ({ children }: { children: React.ReactNode }) =>
  children;
