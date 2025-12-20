/**
 * Theme Adapter Interface
 * Abstract interface for theme management operations
 */

export type ThemeName =
  | 'purpleDream'
  | 'oceanBlue'
  | 'forestGreen'
  | 'sunsetOrange'
  | 'rosePink';

export interface ThemeMetadata {
  name: string;
  description: string;
  icon: string;
}

export interface ThemeAdapter {
  /**
   * Get the current active theme
   */
  getCurrentTheme(): any;

  /**
   * Get the current theme name
   */
  getCurrentThemeName(): ThemeName;

  /**
   * Set the active theme
   * @param name - Theme name to activate
   */
  setTheme(name: ThemeName): void;

  /**
   * Get metadata for a specific theme
   * @param name - Theme name
   */
  getThemeMetadata(name: ThemeName): ThemeMetadata;

  /**
   * Get metadata for all available themes
   */
  getAllThemeMetadata(): Record<ThemeName, ThemeMetadata>;

  /**
   * Subscribe to theme changes
   * @param callback - Function to call when theme changes
   * @returns Unsubscribe function
   */
  onThemeChange(callback: (theme: any) => void): () => void;

  /**
   * Get all available theme names
   */
  getAvailableThemes(): ThemeName[];
}
