/**
 * Theme Service
 * High-level service for handling theme management
 * Provides business logic layer over the adapter
 */

import { storageService, StorageKeys } from '../../modules/services/storage';
import { ThemeAdapter, ThemeName, ThemeMetadata } from './theme-adapter';
import { UnistylesThemeAdapter } from './unistyles-theme-adapter';

class ThemeService {
  private adapter: ThemeAdapter;

  constructor(adapter: ThemeAdapter) {
    this.adapter = adapter;
  }

  /**
   * Get the currently active theme
   */
  getCurrentTheme(): any {
    return this.adapter.getCurrentTheme();
  }

  /**
   * Get the current theme name
   */
  getCurrentThemeName(): ThemeName {
    return this.adapter.getCurrentThemeName();
  }

  /**
   * Set the active theme and persist to storage
   * @param name - Theme name to activate
   */
  async setTheme(name: ThemeName): Promise<void> {
    try {
      this.adapter.setTheme(name);
      await storageService.setItem(StorageKeys.APP_THEME, name);
    } catch (error) {
      console.error('Failed to save theme:', error);
      throw error;
    }
  }

  /**
   * Get metadata for a specific theme
   */
  getThemeMetadata(name: ThemeName): ThemeMetadata {
    return this.adapter.getThemeMetadata(name);
  }

  /**
   * Get metadata for all available themes
   */
  getAllThemeMetadata(): Record<ThemeName, ThemeMetadata> {
    return this.adapter.getAllThemeMetadata();
  }

  /**
   * Get all available theme names
   */
  getAvailableThemes(): ThemeName[] {
    return this.adapter.getAvailableThemes();
  }

  /**
   * Subscribe to theme changes
   */
  onThemeChange(callback: (theme: any) => void): () => void {
    return this.adapter.onThemeChange(callback);
  }

  /**
   * Initialize theme from storage on app start
   */
  async initializeTheme(): Promise<void> {
    try {
      const saved = await storageService.getItem(StorageKeys.APP_THEME);
      const validThemes = this.adapter.getAvailableThemes();

      if (
        saved &&
        typeof saved === 'string' &&
        validThemes.includes(saved as ThemeName)
      ) {
        this.adapter.setTheme(saved as ThemeName);
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
    }
  }

  /**
   * Check if a theme name is valid
   */
  isValidTheme(name: string): name is ThemeName {
    return this.adapter.getAvailableThemes().includes(name as ThemeName);
  }

  /**
   * Get theme colors for the current theme
   */
  getCurrentColors() {
    return this.adapter.getCurrentTheme().colors;
  }
}

// Create singleton instance with Unistyles adapter
export const themeService = new ThemeService(new UnistylesThemeAdapter());
