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
  readonly onboarding1Title: string;
  readonly onboarding1Description: string;
  readonly onboarding2Title: string;
  readonly onboarding2Description: string;
  readonly onboarding3Title: string;
  readonly onboarding3Description: string;
  readonly areYouSureYouWantToDeleteThisTask: string;
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
  readonly completed: string;
  readonly tapPlusToAddNewTasks: string;
  readonly completeTasksToSeeThemHere: string;
  readonly noTasksForThisDay: string;
  readonly noCompletedTasks: string;
  readonly tryAgain: string;
  readonly selectCountry: string;
  readonly search: string;
  readonly chooseCategory: string;
  readonly editTaskTitle: string;
  readonly addCategory: string;
  readonly index: string;
  readonly calendar: string;
  readonly delete: string;
  readonly focus: string;
  readonly taskTitle: string;
  readonly searchForYourTask: string;
  readonly profile: string;
  readonly createNewCategory: string;
  readonly categoryName: string;
  readonly attachments: string;
  readonly categoryNameWithoutColon: string;
  readonly categoryIcon: string;
  readonly chooseiconFromlibrary: string;
  readonly categoryColor: string;
  readonly description: string;
  readonly whatDoYouWantToDoToday: string;
  readonly chooseTime: string;
  readonly taskTime: string;
  readonly taskCategory: string;
  readonly taskPriorityWithColon: string;
  readonly subTask: string;
  readonly deleteTask: string;
  readonly editTask: string;
  readonly addSubTask: string;
  readonly focusSessionComplete: string;
  readonly focusSessionCompleteMessage: string;
  readonly stopFocusMode: string;
  readonly stop: string;
  readonly focusMode: string;
  readonly notificationWillBeOffWhileYourFocusModeIsOn: string;
  readonly stopFocusing: string;
  readonly overview: string;
  readonly thisWeek: string;
  readonly chooseTheme: string;
  readonly personalizeYourExperience: string;
  readonly changePhoto: string;
  readonly addPhoto: string;
  readonly creatingProfile: string;
  readonly continue: string;
  readonly enterYourEmail: string;
  readonly enterYourName: string;
  readonly createYourProfile: string;
  readonly startFocusing: string;
  readonly areYourSureYouWantToStop: string;
  readonly createCategory: string;
  readonly taskPriority: string;
  readonly tapToAddYourTasks: string;
  readonly edit: string;
  readonly ok: string;
  readonly error: string;
  readonly success: string;
  readonly loading: string;
  readonly today: string;
  readonly clear: string;
  readonly merge: string;
  readonly replaceAll: string;
  readonly editProfile: string;
  readonly theme: string;
  readonly language: string;
  readonly appLock: string;
  readonly exportTodos: string;
  readonly importTodos: string;
  readonly clearProfileData: string;
  readonly account: string;
  readonly appearance: string;
  readonly security: string;
  readonly dataManagement: string;
  readonly name: string;
  readonly email: string;
  readonly emailOptional: string;
  readonly saveChanges: string;
  readonly saving: string;
  readonly sortTasks: string;
  readonly sortDefault: string;
  readonly sortPriorityHighToLow: string;
  readonly sortPriorityLowToHigh: string;
  readonly sortDateNewest: string;
  readonly sortDateOldest: string;
  readonly sortTitleAZ: string;
  readonly sortTitleZA: string;
}

export interface IGeneralMessages extends IMessageGroup {
  readonly skip: string;
  readonly next: string;
  readonly back: string;
  readonly done: string;
  readonly cancel: string;
  readonly save: string;
}

export interface IUserGuideMessages extends IMessageGroup {
  readonly profileSettings: string;
}

export interface IAccessibilityMessages extends IMessageGroup {
  readonly onboardingFirstImage: string;
}

export interface IApiErrorMessages extends IMessageGroup {
  readonly authTokenExpired: string;
}

export interface IMessageTexts extends IMessageGroup {
  readonly failedToUpdateAvatar: string;
  readonly failedToSelectImage: string;
  readonly failedToCreateProfile: string;
  readonly biometricUnavailable: string;
  readonly appLockEnabled: string;
  readonly appLockEnabledMessage: string;
  readonly verifyToDisableAppLock: string;
  readonly appLockDisabled: string;
  readonly appLockDisabledMessage: string;
  readonly noTodos: string;
  readonly noTodosToExport: string;
  readonly exportFailed: string;
  readonly failedToExportTodos: string;
  readonly invalidBackupFile: string;
  readonly importTodosTitle: string;
  readonly howToImport: string;
  readonly importFailed: string;
  readonly failedToImportTodos: string;
  readonly replaceAllTodos: string;
  readonly replaceAllTodosWarning: string;
  readonly importSuccessful: string;
  readonly successfullyImported: string;
  readonly andCategories: string;
  readonly itemsSkipped: string;
  readonly errorsOccurred: string;
  readonly clearProfileDataConfirm: string;
  readonly profileCleared: string;
  readonly profileClearedMessage: string;
  readonly failedToClearProfileData: string;
  readonly pleaseEnterName: string;
  readonly pleaseEnterEmail: string;
  readonly profileUpdatedSuccessfully: string;
  readonly failedToUpdateProfile: string;
  readonly languageChangeRestart: string;
  readonly failedToChangeLanguage: string;
  readonly pleaseEnterTaskTitle: string;
  readonly pleaseSelectCategory: string;
  readonly pleaseSelectDueDate: string;
  readonly unableToUpdateTodo: string;
  readonly unableToCreateTodo: string;
  readonly unableToDeleteTodo: string;
  readonly unableToRestoreTask: string;
  readonly pleaseEnterCategoryName: string;
  readonly pleaseSelectImage: string;
  readonly pleaseChooseColor: string;
  readonly unableToCreateCategory: string;
  readonly securityWarning: string;
  readonly changeYourNameAndEmail: string;
  readonly chooseAppLanguage: string;
  readonly protectAppWithBiometric: string;
  readonly protectedWith: string;
  readonly backupYourTodosToFile: string;
  readonly restoreTodosFromBackup: string;
  readonly selectTheme: string;
  readonly invalidName: string;
  readonly pleaseEnterValidName: string;
  readonly updateYourPersonalInformation: string;
  readonly enterYourNamePlaceholder: string;
  readonly enterYourEmailPlaceholder: string;
  readonly unableToMarkTodoAsCompleted: string;
  readonly iUnderstand: string;
  readonly chooseLanguage: string;
  readonly upTodoIsLocked: string;
  readonly somethingWentWrong: string;
  readonly pressMeToLogin: string;
  readonly sortTasks: string;
  readonly sortDefault: string;
  readonly sortPriorityHighToLow: string;
  readonly sortPriorityLowToHigh: string;
  readonly sortDateNewest: string;
  readonly sortDateOldest: string;
  readonly sortTitleAZ: string;
  readonly sortTitleZA: string;
}

export interface ISystemMessages {
  readonly apiError: IApiErrorMessages;
  readonly error: IErrorMessages;
  readonly general: IGeneralMessages;
  readonly instruction: IInstructionMessages;
  readonly label: ILabelTexts;
  readonly userGuide: IUserGuideMessages;
  readonly accessibility: IAccessibilityMessages;
  readonly message: IMessageTexts;
}
