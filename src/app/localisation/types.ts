import { Dictionary } from '../types';

export type LocaleMessage = {
  locale: string;
  messages: object;
};

export type DateTimeFormatOptions = {
  value: Date | number;
  style: any;
  localeMatcher: 'best fit' | 'lookup';
  formatMatcher: 'basic' | 'best fit';

  timeZone: string;
  hour12: boolean;

  weekday: 'narrow' | 'short' | 'long';
  era: 'narrow' | 'short' | 'long';
  year: 'numeric' | '2-digit';
  month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
  day: 'numeric' | '2-digit';
  hour: 'numeric' | '2-digit';
  minute: 'numeric' | '2-digit';
  second: 'numeric' | '2-digit';
  timeZoneName: 'short' | 'long';
};

export interface IFormatted<T> {
  (props: T): any;
  propTypes: T;
}

export type HTMLFormatOptions = {
  id: string;
  style?: any;
};

export type MessageFormatOptions = {
  id: string;
  style?: any;
  values?: any;
  defaultMessage?: string;
};

export type NumberFormatOptions = {
  style?: any;
  value: number;
  currency?: string;
  localeMatcher?: 'best fit' | 'lookup';
  formatStyle?: 'decimal' | 'currency' | 'percent';
  currencyDisplay?: 'symbol' | 'code' | 'name';
  useGrouping?: boolean;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
};

export type PluralFormatOptions = {
  style?: 'cardinal' | 'ordinal';
  value: any;
  other: any;
  zero?: any;
  one?: any;
  two?: any;
  few?: any;
  many?: any;
  children?: (formattedPlural: any) => any;
};

type configMap = Dictionary<string>;

export type localeConfig = {
  systemMessages: any;
  defaultLanguageLocale?: configMap;
  localeFallbackMap?: configMap;
};

export interface IMessageGroup {}

export interface IErrorMessages extends IMessageGroup {
  readonly nothingFound: string;
  readonly fieldIsRequired: string;
}

export interface IInstructionMessages extends IMessageGroup {
  readonly underProgress: string;
}

export interface ILabelTexts extends IMessageGroup {
  readonly employer: string;
  readonly addTask: string;
  readonly taskName: string;
  readonly tagline: string;
  readonly detailedTagline: string;
  readonly getStarted: string;
  readonly alreadyHaveAnAccount: string;
  readonly login: string;
  readonly tryAgain: string;
  readonly selectCountry: string;
  readonly search: string;
  readonly chooseCategory: string;
  readonly addCategory: string;
  readonly index: string;
  readonly calendar: string;
  readonly focus: string;
  readonly profile: string;
  readonly createNewCategory: string;
  readonly categoryName: string;
  readonly categoryNameWithoutColon: string;
  readonly categoryIcon: string;
  readonly chooseiconFromlibrary: string;
  readonly categoryColor: string;
  readonly description: string;
  readonly whatDoYouWantToDoToday: string;
  readonly chooseTime: string;
  readonly createCategory: string;
  readonly taskPriority: string;
  readonly tapToAddYourTasks: string;
}

export interface IGeneralMessages extends IMessageGroup {
  readonly skip: string;
  readonly next: string;
  readonly done: string;
  readonly cancel: string;
  readonly save: string;
}

export interface IUserGuideMessages extends IMessageGroup {
  readonly profileSettings: string;
}

export interface IAccessablityMessages extends IMessageGroup {
  readonly onboardingFirstImage: string;
}

export interface IApiErrorMessages extends IMessageGroup {
  readonly authTokenExpired: string;
}

export interface ISystemMessages {
  readonly apiError: IApiErrorMessages;
  readonly error: IErrorMessages;
  readonly general: IGeneralMessages;
  readonly instruction: IInstructionMessages;
  readonly label: ILabelTexts;
  readonly userGuide: IUserGuideMessages;
  readonly accessablity: IAccessablityMessages;
}
