'use strict';

import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getTranslationService } from './translation-provider';
import {
  DateTimeFormatOptions,
  HTMLFormatOptions,
  IFormatted,
  MessageFormatOptions,
  NumberFormatOptions,
  PluralFormatOptions,
} from './types';
import { LocaleProvider } from './locale-provider';
const PropTypes = require('prop-types');

const DateDefaultProps = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

/**
 * Produces a locale-aware component for rendering a date value
 * @param props
 */
export const FormattedDate = function (props: DateTimeFormatOptions) {
  const myProps = { ...props, ...DateDefaultProps };
  const value = myProps.value;
  try {
    const date = value instanceof Date ? value : new Date(value as any);
    const formatter = new Intl.DateTimeFormat(undefined, myProps as any);
    const localized = formatter.format(date as Date);
    return React.createElement(
      Text,
      { style: (myProps as any).style },
      localized,
    );
  } catch (e) {
    return React.createElement(
      Text,
      { style: (myProps as any).style },
      String(value),
    );
  }
};
(FormattedDate as IFormatted<DateTimeFormatOptions>).propTypes = {
  value: PropTypes.any.isRequired,
  style: PropTypes.any,

  localeMatcher: PropTypes.string,
  formatMatcher: PropTypes.string,

  timeZone: PropTypes.string,
  hour12: PropTypes.any,

  weekday: PropTypes.string,
  era: PropTypes.string,
  year: PropTypes.string,
  month: PropTypes.string,
  day: PropTypes.string,
  hour: PropTypes.string,
  minute: PropTypes.string,
  second: PropTypes.string,
  timeZoneName: PropTypes.string,
};

/**
 * Produces a locale-aware component for rendering an HTML value.
 * Auto-updates when language changes
 * @param props
 */
export const FormattedHTMLMessage = function (props: HTMLFormatOptions) {
  // Subscribe to language changes via TranslationService
  const [, setLanguage] = useState('');

  useEffect(() => {
    const translationService = getTranslationService();
    const unsubscribe = translationService.onLanguageChanged(locale => {
      setLanguage(locale);
    });
    return unsubscribe;
  }, []);

  const message = LocaleProvider.formatMessage(
    props.id as string,
    (props as any).values,
  );

  if (Array.isArray(message)) {
    return React.createElement(React.Fragment, null, message);
  }
  return React.createElement(
    Text,
    { style: (props as any).style },
    message as any,
  );
};
(FormattedHTMLMessage as IFormatted<HTMLFormatOptions>).propTypes = {
  id: PropTypes.any,
  style: PropTypes.any,
};

/**
 * Produces a locale-aware component for rendering some text
 * Auto-updates when language changes
 * @param props
 */
export const FormattedMessage = function (props: MessageFormatOptions) {
  // Subscribe to language changes via TranslationService
  const [, setLanguage] = useState('');

  useEffect(() => {
    const translationService = getTranslationService();
    const unsubscribe = translationService.onLanguageChanged(locale => {
      setLanguage(locale);
    });
    return unsubscribe;
  }, []);

  const messageId = props?.id || '?missing?';
  const formatted = LocaleProvider.formatMessage(messageId, props.values);

  if (Array.isArray(formatted)) {
    // formatted already contains Text nodes
    return React.createElement(React.Fragment, null, formatted);
  }

  return React.createElement(Text, { style: props.style }, formatted as any);
};
(FormattedMessage as IFormatted<MessageFormatOptions>).propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.any,
  values: PropTypes.any,
};

/**
 * Produces a locale-aware component for rendering a number.
 * @param props
 */
export const FormattedNumber = function (props: NumberFormatOptions) {
  const textStyle = (props as any).style;
  const formatOptions = {
    localeMatcher: props.localeMatcher,
    style: props?.formatStyle || 'currency',
    currency: props?.currency,
    currencyDisplay: props?.currencyDisplay || 'symbol',
    useGrouping: props.useGrouping,
    minimumIntegerDigits: props.minimumIntegerDigits,
    minimumFractionDigits: props.minimumFractionDigits,
    maximumFractionDigits: props.maximumFractionDigits,
    minimumSignificantDigits: props.minimumSignificantDigits,
    maximumSignificantDigits: props.maximumSignificantDigits,
    value: props.value,
  };

  try {
    const formatter = new Intl.NumberFormat(
      undefined as any,
      {
        style: formatOptions.style as any,
        currency: formatOptions.currency as any,
        minimumFractionDigits: formatOptions.minimumFractionDigits as any,
        maximumFractionDigits: formatOptions.maximumFractionDigits as any,
        useGrouping: formatOptions.useGrouping as any,
      } as any,
    );
    const localized = formatter.format(formatOptions.value as number);
    return React.createElement(Text, { style: textStyle }, localized);
  } catch (e) {
    return React.createElement(
      Text,
      { style: textStyle },
      String(formatOptions.value),
    );
  }
};
(FormattedNumber as IFormatted<NumberFormatOptions>).propTypes = {
  style: PropTypes.any,
  localeMatcher: PropTypes.string,
  formatStyle: PropTypes.string,
  currency: PropTypes.string,
  currencyDisplay: PropTypes.string,
  useGrouping: PropTypes.bool,
  minimumIntegerDigits: PropTypes.number,
  minimumFractionDigits: PropTypes.number,
  maximumFractionDigits: PropTypes.number,
  minimumSignificantDigits: PropTypes.number,
  maximumSignificantDigits: PropTypes.number,
  value: PropTypes.number.isRequired,
};

/**
 * Produces a locale-aware component for rendering a string based on a number value.
 * @param props
 */
export const FormattedPlural = function (props: PluralFormatOptions) {
  // Minimal plural handling: if explicit forms provided use them, else fallback to simple singular/plural
  const value = props.value as number;
  if (props.one !== undefined && props.other !== undefined) {
    const out = value === 1 ? props.one : props.other;
    return React.createElement(Text, { style: (props as any).style }, out);
  }
  // fallback: show value
  return React.createElement(
    Text,
    { style: (props as any).style },
    String(value),
  );
};
(FormattedPlural as IFormatted<PluralFormatOptions>).propTypes = {
  style: PropTypes.string,
  value: PropTypes.any,
  zero: PropTypes.any,
  one: PropTypes.any.isRequired,
  other: PropTypes.any.isRequired,
  two: PropTypes.any,
  few: PropTypes.any,
  many: PropTypes.any,
  children: PropTypes.any,
};

type RelativeFormatOptions = {
  style?: 'best fit' | 'numeric';
  units?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
  value: Date | Number;
  format?: string;
  updateInterval?: number;
  initialNow?: any;
  children?: (formattedDate: string) => any;
};

/**
 * Produces a locale-aware component for rendering a string representative of a date/time relative to the present moment (e.g., '2 days ago')
 * @param props
 */
export const FormattedRelative = function (props: RelativeFormatOptions) {
  try {
    const now = props.initialNow || Date.now();
    const then =
      props.value instanceof Date ? props.value.getTime() : Number(props.value);
    const diff = (then - now) / 1000;
    const abs = Math.abs(diff);
    let unit: Intl.RelativeTimeFormatUnit = 'second';
    let val = Math.round(diff);
    if (abs > 3600 * 24) {
      unit = 'day';
      val = Math.round(diff / (3600 * 24));
    } else if (abs > 3600) {
      unit = 'hour';
      val = Math.round(diff / 3600);
    } else if (abs > 60) {
      unit = 'minute';
      val = Math.round(diff / 60);
    }
    const rtf = new Intl.RelativeTimeFormat(undefined, {
      numeric: props.style === 'numeric' ? 'always' : 'auto',
    });
    const localized = rtf.format(val as number, unit);
    return React.createElement(
      Text,
      { style: (props as any).style },
      localized,
    );
  } catch (e) {
    return React.createElement(
      Text,
      { style: (props as any).style },
      String(props.value),
    );
  }
};
(FormattedRelative as IFormatted<RelativeFormatOptions>).propTypes = {
  style: PropTypes.any,
  units: PropTypes.string,
  value: PropTypes.any,
  format: PropTypes.string,
  updateInterval: PropTypes.number,
  initialNow: PropTypes.any,
  children: PropTypes.any,
};

/**
 * Produces a locale-aware component for rendering a time value.
 * @param props
 */
export const FormattedTime = function (props: DateTimeFormatOptions) {
  try {
    const date =
      props.value instanceof Date ? props.value : new Date(props.value as any);
    const formatter = new Intl.DateTimeFormat(undefined, props as any);
    const localized = formatter.format(date as Date);
    return React.createElement(
      Text,
      { style: (props as any).style },
      localized,
    );
  } catch (e) {
    return React.createElement(
      Text,
      { style: (props as any).style },
      String(props.value),
    );
  }
};
(FormattedTime as IFormatted<DateTimeFormatOptions>).propTypes = {
  value: PropTypes.any.isRequired,
  style: PropTypes.any,
  localeMatcher: PropTypes.string,
  formatMatcher: PropTypes.string,
  timeZone: PropTypes.string,
  hour12: PropTypes.any,
  weekday: PropTypes.string,
  era: PropTypes.string,
  year: PropTypes.string,
  month: PropTypes.string,
  day: PropTypes.string,
  hour: PropTypes.string,
  minute: PropTypes.string,
  second: PropTypes.string,
  timeZoneName: PropTypes.string,
};
