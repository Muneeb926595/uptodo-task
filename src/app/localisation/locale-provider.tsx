/* eslint-disable camelcase */
'use strict';
import { flatten } from 'flat';
import { Constants } from '../globals';
import { ISystemMessages } from './types';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { Dictionary } from '../types';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

export const appLocalsMap = () => {
  return {
    'en-US': 'en',
    // 'es-US': 'es',
    // 'tl-PH': 'tl'
  };
};

export class LocaleProvider extends Component<any> {
  public static currency: string = Constants.defaults.DEFAULT_APP_CURRENCY;
  private static readonly error = {
    notInitialized: 'LocaleProvider was not initialized',
  };

  private static locale: string = Constants.defaults.DEFAULT_APP_LOCALE;
  private static messages: any = {};
  private static _messageIDs: any = {};

  private static onError: () => void;

  static get IDs(): ISystemMessages {
    return this._messageIDs;
  }

  static setCurrency(currency: string) {
    LocaleProvider.currency = currency;
  }
  static async init(preferredLocale: string) {
    const localTranslatinos = LocaleProvider.importLocalTranslations();

    // prepare i18next resources
    const resources: any = {};
    const localMap = appLocalsMap();
    Object.keys(localTranslatinos).forEach(loc => {
      // register using the full locale key (e.g. 'en-US')
      resources[loc] = { translation: localTranslatinos[loc] };
      // also register short mapping if present (e.g. 'en') so changeLanguage('en') works
      const short = (localMap as any)[loc];
      if (short) {
        resources[short] = { translation: localTranslatinos[loc] };
      }
    });

    // helper to resolve incoming preferredLocale into a registered resource key
    const resolveLocaleKey = (inLocale?: string) => {
      if (!inLocale) return Constants.defaults.DEFAULT_APP_LOCALE;
      if (resources[inLocale]) return inLocale;
      // try replacing '_' with '-'
      const alt = inLocale.replace('_', '-');
      if (resources[alt]) return alt;
      // try reverse mapping: if input is short like 'en', find full key
      const reverse = Object.keys(localMap).find(
        k => (localMap as any)[k] === inLocale,
      );
      if (reverse && resources[reverse]) return reverse;
      return Constants.defaults.DEFAULT_APP_LOCALE;
    };

    const initialLng = resolveLocaleKey(preferredLocale);

    await i18n.use(initReactI18next).init({
      resources,
      lng: initialLng,
      fallbackLng: Constants.defaults.DEFAULT_APP_LOCALE,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    } as any);

    const [ids, texts] = await LocaleProvider.translationsByLocale(
      preferredLocale,
      localTranslatinos,
    );
    LocaleProvider.messages = texts;
    LocaleProvider._messageIDs = ids;
  }

  static t(key?: string, values?: any): string {
    if (key) {
      try {
        return i18n.t(key, values) as string;
      } catch (e) {
        // fallback to previously loaded flattened messages
        let localized: string = LocaleProvider.messages[key];

        if (values) {
          Object.keys(values).forEach((valueKey, index) => {
            localized = localized.replace(
              RegExp(`{${valueKey}}`, 'g'),
              values[valueKey] as string,
            );
          });
        }

        return localized;
      }
    } else {
      return 'key unknown';
    }
  }

  private static async translationsByLocale(
    preferredLocale: string,
    translations: Dictionary<ISystemMessages>,
    fallbackMap?: Dictionary<string>,
  ): Promise<[ISystemMessages, ISystemMessages]> {
    const locale = preferredLocale || 'en-US';
    let messagesByLocale = translations[locale];

    if (!messagesByLocale && fallbackMap) {
      // can't find mesages by user's locale on device,
      // try to get by using fallbackc map
      const fallbackLocale = fallbackMap[locale];
      messagesByLocale = translations[fallbackLocale];
    }

    if (!messagesByLocale) {
      // still don't have messages, get messages by default locale ->
      messagesByLocale = translations[Constants.defaults.DEFAULT_APP_LOCALE];
    }
    const ids = LocaleProvider.getMessageIds(messagesByLocale);
    const messages: ISystemMessages = flatten(messagesByLocale);
    return [ids as ISystemMessages, messages];
  }

  // move this to const
  private static importLocalTranslations(): Dictionary<ISystemMessages> {
    const enUS = require('./locales/en-US.json');
    // const esUS = require('./locales/es-US.json');
    // const tlPH = require('./locales/tl-PH.json');
    return {
      'en-US': enUS,
      // 'es-US': esUS,
      // 'tl-PH': tlPH
    };
  }

  static getMessageIds(messages: ISystemMessages) {
    const messageIndex = {};

    if (!messages) {
      return {};
    }

    function buildIndex(
      index: { [index: string]: any },
      target: { [index: string]: any },
      path?: string,
    ) {
      Object.keys(target).forEach(k => {
        const currentPath = (path ? path + '.' : '') + k;
        if (typeof target[k] === 'string') {
          index[k] = currentPath;
        } else {
          index[k] = {};
          buildIndex(index[k], target[k], currentPath);
        }
      });
    }

    buildIndex(messageIndex, messages);
    return messageIndex;
  }

  static setLocale(locale: string) {
    // prefer using changeLanguage to ensure i18next updates and triggers re-renders
    LocaleProvider.changeLanguage(locale).catch(() => {
      LocaleProvider.locale = locale.replace('_', '-');
    });
  }

  static setPreferredLocale(preferredLocale: string, fallbackLocale: string) {
    // keep backwards-compatible API but ensure i18next language updates
    LocaleProvider.changeLanguage(preferredLocale).catch(() => {
      LocaleProvider.locale = preferredLocale.replace('_', '-');
    });
  }

  static async changeLanguage(preferredLocale: string) {
    const localMap = appLocalsMap();
    // normalize
    const normalized = preferredLocale
      ? preferredLocale.replace('_', '-')
      : preferredLocale;
    // if a short code like 'en' is passed, try to find the full key (e.g. 'en-US')
    let target = normalized;
    if (!i18n.hasResourceBundle(target, 'translation')) {
      // try map where map[full] === short
      const reverse = Object.keys(localMap).find(
        k => (localMap as any)[k] === target,
      );
      if (reverse) target = reverse;
      else if (i18n.hasResourceBundle(target.split('-')[0], 'translation'))
        target = target.split('-')[0];
    }

    LocaleProvider.locale = target;
    try {
      // debug logging to help trace language resolution
      // eslint-disable-next-line no-console
      console.info(
        '[LocaleProvider] changeLanguage -> target:',
        target,
        'normalized:',
        normalized,
        'hasResource:',
        i18n.hasResourceBundle(target, 'translation'),
      );
      await i18n.changeLanguage(target);
      // eslint-disable-next-line no-console
      console.info('[LocaleProvider] language changed to', i18n.language);
    } catch (e) {
      // fallback: try change with normalized
      // eslint-disable-next-line no-console
      console.warn('[LocaleProvider] changeLanguage failed for', target, e);
      await i18n.changeLanguage(normalized).catch(() => {});
    }
  }

  /**
   * Subscribe to language change events. Returns an unsubscribe function.
   */
  static onLanguageChanged(cb: (lng: string) => void) {
    i18n.on('languageChanged', cb);
    return () => i18n.off('languageChanged', cb);
  }

  static formatMessage(id: string, values?: any) {
    let parts: any = [];
    // try using i18next first to get interpolated string
    let resourceString: any = id;
    try {
      resourceString = i18n.t(id, values);
    } catch (e) {
      resourceString =
        LocaleProvider.messages && LocaleProvider.messages[id]
          ? LocaleProvider.messages[id]
          : id;
    }

    if (values) {
      Object.keys(values).forEach(key => {
        if (typeof values[key] === 'function') {
          let idx = 0;
          parts = String(resourceString)
            .split(`{${key}}`)
            .map(p => (p.length ? p : values[key]()))
            .map(p => <Text key={idx++}>{p}</Text>);
        } else if (typeof values[key] !== 'object') {
          resourceString = String(resourceString).replace(
            RegExp(`{${key}}`, 'g'),
            values[key],
          );
        }
      });
    }

    return parts.length ? parts : resourceString;
  }

  render() {
    return <I18nextProvider i18n={i18n}>{this.props.children}</I18nextProvider>;
  }
}
