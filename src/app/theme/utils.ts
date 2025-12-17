import { StyleSheet } from 'react-native';
import { ThemeService } from './service';
import type {
  ThemeColors,
  ThemeSpacing,
  ThemeRadii,
  ThemeTypography,
} from './colors';

/**
 * Helper to create dynamic themed styles.
 * Usage:
 * const useStyles = themed(tokens => ({
 *   container: { backgroundColor: tokens.colors.background }
 * }));
 * // in component
 * const styles = useStyles();
 */
export type ThemeTokens = {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  typography: ThemeTypography;
};

export function themed<T extends { [k: string]: any }>(
  factory: (tokens: ThemeTokens) => T,
) {
  let current = StyleSheet.create(
    factory(ThemeService.getTokens() as ThemeTokens),
  );

  const unsub = ThemeService.onChange(() => {
    current = StyleSheet.create(
      factory(ThemeService.getTokens() as ThemeTokens),
    );
  });

  // return a function that components call during render to get up-to-date styles
  const getStyles = () => current;

  // attach an unsubscribe to allow cleanup if necessary
  (getStyles as any).unsubscribe = unsub;

  return getStyles as () => T;
}
