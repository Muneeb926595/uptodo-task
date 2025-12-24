/* eslint-disable camelcase */
'use strict';
import { flatten } from 'flat';
import { Constants } from '../../globals';
import { ISystemMessages } from './types';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { Dictionary } from '../../types';
import { getTranslationService } from './translation-provider';

/**
 * LocaleProvider - Static translation methods
 *
 * Provides static methods for translation without using hooks.
 * Works alongside the new hook-based API - use whichever you prefer.
 */
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

  /**
   * Translate a key to localized string
   * @param key - Translation key
   * @param values - Interpolation values
   */
  static t(key?: string, values?: any): string {
    if (!key) return 'key unknown';

    const translationService = getTranslationService();
    return translationService.translate(key, values);
  }

  /**
   * Build IDs structure from translation messages
   * Called internally during app initialization
   */
  static buildMessageIds(messages: ISystemMessages) {
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
    LocaleProvider._messageIDs = messageIndex;
    return messageIndex;
  }

  static setLocale(locale: string) {
    const translationService = getTranslationService();
    translationService.changeLanguage(locale).catch(console.error);
    LocaleProvider.locale = locale;
  }

  static setPreferredLocale(preferredLocale: string, fallbackLocale: string) {
    LocaleProvider.setLocale(preferredLocale);
  }

  /**
   * Change the current language
   * @param preferredLocale - New locale code (e.g., 'en-US', 'es-ES')
   */
  static async changeLanguage(preferredLocale: string) {
    const translationService = getTranslationService();
    await translationService.changeLanguage(preferredLocale);
    LocaleProvider.locale = translationService.getCurrentLanguage();
  }

  /**
   * Subscribe to language change events. Returns an unsubscribe function.
   * @param cb - Callback function called when language changes
   */
  static onLanguageChanged(cb: (lng: string) => void) {
    const translationService = getTranslationService();
    return translationService.onLanguageChanged(cb);
  }

  /**
   * Format a message with interpolation
   * @param id - Translation key
   * @param values - Interpolation values (supports functions for complex cases)
   */
  static formatMessage(id: string, values?: any) {
    const translationService = getTranslationService();
    let resourceString = translationService.translate(id, values);

    // Handle function values for backward compatibility
    if (values) {
      let parts: any = [];
      Object.keys(values).forEach(key => {
        if (typeof values[key] === 'function') {
          let idx = 0;
          parts = String(resourceString)
            .split(`{${key}}`)
            .map(p => (p.length ? p : values[key]()))
            .map(p => <Text key={idx++}>{p}</Text>);
        }
      });
      return parts.length ? parts : resourceString;
    }

    return resourceString;
  }

  render() {
    // TranslationProvider handles rendering now
    return <>{this.props.children}</>;
  }
}
