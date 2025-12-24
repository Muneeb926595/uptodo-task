//   Translation Provider

//   Dependency Injection container for the translation service.
//   Provides React context and hooks for accessing translations.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { I18nextAdapter } from './i18next-adapter';
import {
  TranslationInterpolationValues,
  TranslationService,
} from './translation-service.interface';

// Singleton instance
let translationServiceInstance: I18nextAdapter | null = null;

export const getTranslationService = (): I18nextAdapter => {
  if (!translationServiceInstance) {
    translationServiceInstance = new I18nextAdapter();
  }
  return translationServiceInstance;
};

// React Context
const TranslationContext = createContext<TranslationService | null>(null);

interface TranslationProviderProps {
  children: React.ReactNode;
  service?: TranslationService;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  service,
}) => {
  const translationService = service || getTranslationService();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Mark as ready after service is available
    // Actual initialization happens in app.tsx
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  // For I18nextAdapter, wrap with I18nextProvider for useTranslation hook
  if (translationService instanceof I18nextAdapter) {
    const i18nextInstance = translationService.getI18nextInstance();
    return (
      <I18nextProvider i18n={i18nextInstance}>
        <TranslationContext.Provider value={translationService}>
          {children}
        </TranslationContext.Provider>
      </I18nextProvider>
    );
  }

  //   if translationService is not instance of I18nextAdapter then that means it's a custom implementation of TranslationService of using the react-intl library or something else handel accordingly
  return (
    <TranslationContext.Provider value={translationService}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to access the translation service
export const useTranslationService = (): TranslationService => {
  const service = useContext(TranslationContext);
  if (!service) {
    throw new Error(
      'useTranslationService must be used within TranslationProvider',
    );
  }
  return service;
};

/**
 * Hook for translating text
 *
 * @example
 * const t = useTranslate();
 * <Text>{t('general.save')}</Text>
 */
export const useTranslate = () => {
  const service = useTranslationService();
  return (key: string, values?: TranslationInterpolationValues) =>
    service.translate(key, values);
};

/**
 * Hook for accessing current language and changing it
 *
 * @example
 * const { language, changeLanguage } = useLanguage();
 * await changeLanguage('es-US');
 */
export const useLanguage = () => {
  const service = useTranslationService();
  const [language, setLanguage] = useState(service.getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = service.onLanguageChanged(locale => {
      setLanguage(locale);
    });
    return unsubscribe;
  }, [service]);

  return {
    language,
    changeLanguage: (locale: string) => service.changeLanguage(locale),
    supportedLocales: service.getConfig().supportedLocales,
  };
};
