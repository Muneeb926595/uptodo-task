import React, { useEffect, useState } from 'react';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import './app/utils/ignore-warnings';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { LocaleProvider } from './app/localisation/locale-provider';
import { ThemeProvider } from './app/theme/provider';
import { Constants } from './app/globals';
import { store } from './app/stores';
import { Provider } from 'react-redux';
import { ReactQueryProvider } from './app/services/reactQuery/queryClient';
import { AppNavigator } from './app/navigation';
import StorageHelper, { StorageKeys } from './app/data/mmkv-storage';
import { Colors } from './app/theme';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

if (__DEV__) {
  //   require('../ReactotronConfig');
}

function App() {
  const [appLocaleProviderReady, setAppLocaleProviderReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initAppAssets();
      setAppLocaleProviderReady(true);
    })();
  }, []);

  /**
   * Setup and init Locale provider, api, and repositories
   */
  const initAppAssets = async () => {
    let appLocale = Constants.defaults.DEFAULT_APP_LOCALE;
    try {
      appLocale = (await StorageHelper.getItem(
        StorageKeys.SELECTED_APP_LANGUAGE,
      )) as string;
    } catch (e) {
      //   throw new AppError('App.tsx', 'initLocaleProvider', e);
    }
    await LocaleProvider.init(appLocale);
  };

  return appLocaleProviderReady ? (
    <Provider store={store}>
      <ReactQueryProvider>
        <ThemeProvider>
          <LocaleProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={Colors.white}
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <AppNavigator />
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </LocaleProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </Provider>
  ) : null;
}

export default App;
