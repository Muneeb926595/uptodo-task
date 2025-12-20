/**
 * Translation Service Interface
 *
 * Defines the contract for internationalization services.
 * This abstraction allows switching translation libraries without affecting the codebase.
 */

export interface TranslationConfig {
  defaultLocale: string;
  fallbackLocale: string;
  supportedLocales: string[];
}

export interface TranslationInterpolationValues {
  [key: string]: string | number | boolean | (() => React.ReactNode);
}

export interface TranslationService {
  /**
   * Initialize the translation service with preferred locale
   */
  initialize(preferredLocale: string): Promise<void>;

  /**
   * Translate a key to localized string
   * @param key - Translation key (e.g., 'general.save')
   * @param values - Interpolation values
   */
  translate(key: string, values?: TranslationInterpolationValues): string;

  /**
   * Change the current language
   * @param locale - New locale code (e.g., 'en-US', 'es-ES')
   */
  changeLanguage(locale: string): Promise<void>;

  /**
   * Get the current active language
   */
  getCurrentLanguage(): string;

  /**
   * Check if a translation key exists
   */
  exists(key: string): boolean;

  /**
   * Subscribe to language change events
   * @returns Unsubscribe function
   */
  onLanguageChanged(callback: (locale: string) => void): () => void;

  /**
   * Get configuration
   */
  getConfig(): TranslationConfig;
}
