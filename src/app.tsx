// Initialize Unistyles FIRST before any other imports
import './app/theme/unistyles';

import React, { useEffect, useState } from 'react';
import './app/utils/ignore-warnings';
import { MagicModalPortal } from 'react-native-magic-modal';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, StyleSheet, View } from 'react-native';
import { getTranslationService, TranslationProvider } from './app/localisation';
import { Constants } from './app/globals';
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
import { initializeDayjsPlugins } from './app/utils/timeDateUtils';

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
