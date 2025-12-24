/**
 * I18next Adapter
 *
 * Concrete implementation of TranslationService using i18next library.
 * Isolates i18next-specific logic, making it replaceable in the future.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Constants } from '../../globals';
import {
  TranslationConfig,
  TranslationInterpolationValues,
  TranslationService,
} from './translation-service.interface';

// Translation resource imports
import enUS from './locales/en-US.json';
import esUS from './locales/es-US.json';

export class I18nextAdapter implements TranslationService {
  private config: TranslationConfig;
  private initialized = false;

  constructor(config?: Partial<TranslationConfig>) {
    this.config = {
      defaultLocale:
        config?.defaultLocale || Constants.defaults.DEFAULT_APP_LOCALE,
      fallbackLocale:
        config?.fallbackLocale || Constants.defaults.DEFAULT_APP_LOCALE,
      supportedLocales: config?.supportedLocales || ['en-US', 'es-US'],
    };
  }

  async initialize(preferredLocale: string): Promise<void> {
    if (this.initialized) {
      console.warn('[I18nextAdapter] Already initialized');
      return;
    }

    const resources = this.prepareResources();
    const resolvedLocale = this.resolveLocale(preferredLocale);

    await i18n.use(initReactI18next).init({
      resources,
      lng: resolvedLocale,
      fallbackLng: this.config.fallbackLocale,
      interpolation: {
        escapeValue: false, // React already escapes
        prefix: '{',
        suffix: '}',
      },
      react: {
        useSuspense: false,
      },
      // Enable better debugging in development
      debug: __DEV__,
    });

    this.initialized = true;

    // Build LocaleProvider.IDs structure for backward compatibility
    this.buildLocaleProviderIds();

    console.info(`[I18nextAdapter] Initialized with locale: ${i18n.language}`);
  }

  translate(key: string, values?: TranslationInterpolationValues): string {
    this.ensureInitialized();

    try {
      const result = i18n.t(key, values as any);
      return String(result);
    } catch (error) {
      console.error(
        `[I18nextAdapter] Translation error for key: ${key}`,
        error,
      );
      return key;
    }
  }

  async changeLanguage(locale: string): Promise<void> {
    this.ensureInitialized();

    const resolvedLocale = this.resolveLocale(locale);

    if (!this.isLocaleSupported(resolvedLocale)) {
      console.warn(
        `[I18nextAdapter] Locale "${resolvedLocale}" not supported, falling back to ${this.config.defaultLocale}`,
      );
      await i18n.changeLanguage(this.config.defaultLocale);
      return;
    }

    await i18n.changeLanguage(resolvedLocale);
    console.info(`[I18nextAdapter] Language changed to: ${i18n.language}`);
  }

  getCurrentLanguage(): string {
    this.ensureInitialized();
    return i18n.language;
  }

  exists(key: string): boolean {
    this.ensureInitialized();
    return i18n.exists(key);
  }

  onLanguageChanged(callback: (locale: string) => void): () => void {
    this.ensureInitialized();

    i18n.on('languageChanged', callback);

    return () => {
      i18n.off('languageChanged', callback);
    };
  }

  getConfig(): TranslationConfig {
    return { ...this.config };
  }

  // Get the i18next instance for advanced usage (e.g., React I18nextProvider)
  // This is an implementation detail, should only be used by TranslationProvider

  getI18nextInstance() {
    return i18n;
  }

  private prepareResources() {
    const resources: Record<string, { translation: any }> = {};

    // Register full locale keys (e.g., 'en-US')
    resources['en-US'] = { translation: enUS };
    resources['es-US'] = { translation: esUS };

    // Also register short codes for convenience (e.g., 'en')
    resources['en'] = { translation: enUS };
    resources['es'] = { translation: esUS };

    return resources;
  }

  private resolveLocale(locale: string): string {
    if (!locale) return this.config.defaultLocale;

    // Normalize underscore to hyphen (e.g., 'en_US' -> 'en-US')
    const normalized = locale.replace('_', '-');

    // Check if exact match exists
    if (this.config.supportedLocales.includes(normalized)) {
      return normalized;
    }

    // Try short code (e.g., 'en' from 'en-US')
    const shortCode = normalized.split('-')[0];
    const fullLocale = this.config.supportedLocales.find(l =>
      l.startsWith(shortCode),
    );

    if (fullLocale) return fullLocale;

    // Fallback to default
    return this.config.defaultLocale;
  }

  private isLocaleSupported(locale: string): boolean {
    return (
      this.config.supportedLocales.includes(locale) ||
      this.config.supportedLocales.some(l => l.startsWith(locale.split('-')[0]))
    );
  }

  private ensureInitialized() {
    if (!this.initialized) {
      throw new Error(
        '[I18nextAdapter] Service not initialized. Call initialize() first.',
      );
    }
  }

  /**
   * Build LocaleProvider.IDs structure for backward compatibility
   * This keeps LocaleProvider.IDs working without exposing implementation to app.tsx
   */
  private buildLocaleProviderIds() {
    // Import LocaleProvider to set its IDs
    const { LocaleProvider } = require('./locale-provider');
    const enUS = require('./locales/en-US.json');
    LocaleProvider.buildMessageIds(enUS);
  }
}
