// Initialize Unistyles FIRST before any other imports
import './theme/unistyles';

import React, { useEffect, useState } from 'react';
import './utils/ignore-warnings';
import { MagicModalPortal } from 'react-native-magic-modal';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  getTranslationService,
  TranslationProvider,
} from './services/localisation';
import { Constants } from './globals';
import { store } from './stores';
import { Provider } from 'react-redux';
import { ReactQueryProvider } from './react-query/queryClient';
import { storageService, StorageKeys } from './services/storage';
import { initializeTheme } from './theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MagicSheetPortal } from 'react-native-magic-sheet';
import { ToastProvider } from './context/toast-context';
import { SecurityAlert } from './views/components/security-alert';
import { initializeDayjsPlugins } from './utils/timeDateUtils';
import { AppNavigator } from './views/navigation';

initializeDayjsPlugins();

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
              <View style={styles.modalsWrapper} pointerEvents="box-none">
                <MagicModalPortal />
              </View>
            </GestureHandlerRootView>
          </ToastProvider>
        </TranslationProvider>
      </ReactQueryProvider>
    </Provider>
  ) : null;
}

export default App;

const styles = StyleSheet.create({
  modalsWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },
});
