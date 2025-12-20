/**
 * Theme Module - Unistyles with Adapter Pattern
 * Single source of truth for theme management
 */

// Initialize Unistyles configuration
import './unistyles';

// Re-export context API (main public interface)
export * from './context';

// Re-export service for advanced usage
export { themeService } from './service';
export type { AnimationType, ThemeSwitchOptions } from './service';

// Re-export adapter types for extensibility
export type { ThemeAdapter } from './theme-adapter';

// Re-export Unistyles runtime for advanced cases
export { UnistylesRuntime } from 'react-native-unistyles';

// Backwards compatibility: Colors getter
import { UnistylesRuntime } from 'react-native-unistyles';
export const Colors = new Proxy({} as any, {
  get: (_, prop) => {
    try {
      // Check if runtime is available and has a theme
      const currentTheme = UnistylesRuntime?.themeName;
      if (currentTheme) {
        const { themeMap } = require('./unistyles-theme-adapter');
        const theme = themeMap?.[currentTheme];
        if (theme?.colors?.[prop as string]) {
          return theme.colors[prop as string];
        }
      }
    } catch (error) {
      // Silently catch initialization errors
    }

    // Fallback to purpleDream for any case
    try {
      const { purpleDream } = require('./themes');
      return purpleDream?.colors?.[prop as string];
    } catch {
      return undefined;
    }
  },
});
