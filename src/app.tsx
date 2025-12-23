// Initialize Unistyles FIRST before any other imports
import './app/theme/unistyles';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';
import './app/utils/ignore-warnings';
import { MagicModalPortal } from 'react-native-magic-modal';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, View, Text } from 'react-native';
import { getTranslationService, TranslationProvider } from './app/localisation';
import { Constants } from './app/globals';
import { HotUpdater } from '@hot-updater/react-native';
import { store } from './app/stores';
import { Provider } from 'react-redux';
import { ReactQueryProvider } from './app/services/reactQuery/queryClient';
import { AppNavigator } from './app/navigation';
import { storageService, StorageKeys } from './modules/services/storage';
import { initializeTheme } from './app/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MagicSheetPortal } from 'react-native-magic-sheet';
import { ToastProvider } from './app/context/toast-context';
import { SecurityAlert } from './app/components/security-alert';

// Load critical dayjs plugins immediately (needed for UI rendering)
dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

// Defer less critical dayjs plugins to improve startup time
setTimeout(() => {
  import('dayjs/plugin/relativeTime').then(m => dayjs.extend(m.default));
  import('dayjs/plugin/timezone').then(m => dayjs.extend(m.default));
}, 0);

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
   * Setup and init translation service, theme
   */
  const initAppAssets = async () => {
    let appLocale = Constants.defaults.DEFAULT_APP_LOCALE;
    try {
      appLocale = (await storageService.getItem(
        StorageKeys.SELECTED_APP_LANGUAGE,
      )) as string;
    } catch (e) {
      // Use default locale on error
    }

    const translationService = getTranslationService();

    // Parallelize initialization for faster startup
    await Promise.all([
      translationService.initialize(appLocale),
      initializeTheme(),
    ]);
  };

  return appLocaleProviderReady ? (
    <Provider store={store}>
      <ReactQueryProvider>
        <TranslationProvider>
          <ToastProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                  <SecurityAlert />
                  <AppNavigator />
                </SafeAreaProvider>
                <MagicSheetPortal />
              </BottomSheetModalProvider>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 9999,
                  elevation: 9999,
                }}
                pointerEvents="box-none"
              >
                <MagicModalPortal />
              </View>
            </GestureHandlerRootView>
          </ToastProvider>
        </TranslationProvider>
      </ReactQueryProvider>
    </Provider>
  ) : null;
}
// TODO: fix the supabase scehma issue and then rever this change
// Hot Updater disabled temporarily - will enable after first deployment
// After you run: npx hot-updater deploy -c development
// It will give you the baseURL to use here
export default App;

/*
export default HotUpdater.wrap({
  // You'll need to configure this after setting up Firebase
  // The URL will be provided after running: npx hot-updater deploy
  baseURL: process.env.HOT_UPDATER_BASE_URL || '',
  updateStrategy: 'appVersion',
  updateMode: 'auto',
  fallbackComponent: ({ progress, status }) => (
    <View
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
        {status === 'UPDATING' ? 'Updating...' : 'Checking for Update...'}
      </Text>
      {progress > 0 ? (
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10,
          }}
        >
          {Math.round(progress * 100)}%
        </Text>
      ) : null}
    </View>
  ),
})(App);
