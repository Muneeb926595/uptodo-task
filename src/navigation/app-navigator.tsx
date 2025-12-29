import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReactNavigationDevTools } from '@rozenite/react-navigation-plugin';

import { navigationRef } from './navigation-utils';
import { MainStackParamList } from './types';
import { hideSplash } from 'react-native-splash-view';
import { TabsNavigator } from './tab-navigator';
import { useFirstTimeAppOpen } from '../hooks';
import {
  focusRepository,
  profileRepository,
  todoRepository,
} from '../repository';
import { biometricService } from '../services/biometric';
import { notificationService } from '../services/notifications';
import { LockScreen, OnboardingScreen } from '../views/screens/auth';
import { StorageKeys, storageService } from '../services/storage';
import {
  EditProfileScreen,
  LanguagePickerScreen,
  ProfileSetupScreen,
  ThemePickerScreen,
} from '../views/screens/profile';
import { AuthFlow } from '../views/screens/auth/navigation/auth';
import { EditTodoScreen } from '../views/screens/todo';
import { CreateNewCategoryScreen } from '../views/screens/categories';

const MainAppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = () => {
  const routeNameRef = useRef<any>(null);

  // Enable React Navigation DevTools in Rozenite
  useReactNavigationDevTools({ ref: navigationRef });

  const isFirstTime = useFirstTimeAppOpen();
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isProfileSetup, setIsProfileSetup] = useState<boolean | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [appLockEnabled, setAppLockEnabled] = useState<boolean>(false);

  useEffect(() => {
    initializeApp();
  }, [isFirstTime]);

  const initializeApp = async () => {
    // Only hide splash once we know if it's first time or not
    if (isFirstTime === null) {
      return;
    }

    // Check if profile is set up
    const profileSetupComplete =
      await profileRepository.isProfileSetupComplete();
    setIsProfileSetup(profileSetupComplete);

    // Check if app lock is enabled
    const lockEnabled = await profileRepository.isAppLockEnabled();
    setAppLockEnabled(lockEnabled);

    // If lock is enabled, authenticate
    if (lockEnabled) {
      const result = await biometricService.authenticate(undefined, false);
      setIsLocked(!result.success);
    } else {
      setIsLocked(false);
    }

    hideSplash();

    // Defer service initialization to improve startup time
    // Show UI first, then load services in the background
    setImmediate(() => {
      (async () => {
        // Notifications
        await notificationService.ensurePermissions();

        const todos = await todoRepository.getAll();
        await notificationService.resyncAll(todos);

        // Check for expired focus sessions and restore notifications
        // if user turned on the focus mode then all notification will get canceled and saved to mmkv so we need to restore them later but if app closed then this below snipet will do that on app startup
        try {
          await focusRepository.getActiveSession();
        } catch (e) {
          console.error('Failed to check focus session on startup:', e);
        }
      })();
    });
  };

  // Show nothing while checking first-time status or profile setup
  if (isFirstTime === null || isProfileSetup === null) {
    return null;
  }

  // Show lock screen if app lock is enabled and not authenticated
  if (appLockEnabled && isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />;
  }

  // Show onboarding if first time
  if (isFirstTime && showOnboarding) {
    return (
      <OnboardingScreen
        onComplete={async () => {
          await storageService.setItem(
            StorageKeys.IS_APP_OPEND_FIRSTTIME,
            'false',
          );
          setShowOnboarding(false);
        }}
        onSkip={async () => {
          await storageService.setItem(
            StorageKeys.IS_APP_OPEND_FIRSTTIME,
            'false',
          );
          setShowOnboarding(false);
        }}
      />
    );
  }

  // Show profile setup if not completed
  if (!isProfileSetup) {
    return (
      <ProfileSetupScreen
        onComplete={() => {
          setIsProfileSetup(true);
        }}
      />
    );
  }

  // to debug react-navigation with flipper
  const handleNavContainerReady = () => {
    routeNameRef.current = navigationRef.getCurrentRoute()?.name;
  };

  const handleNavStateChanged = () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      // handle Analytics
    }
    routeNameRef.current = currentRouteName;
  };

  const RenderAppNavigations = (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavContainerReady}
      onStateChange={handleNavStateChanged}
      theme={DarkTheme}
    >
      <MainAppStack.Navigator>
        {true ? (
          <>
            <MainAppStack.Screen
              name="Tabs"
              component={TabsNavigator}
              options={{ headerShown: false }}
            />
            {ScreensWithoutBottomTab}
          </>
        ) : (
          <>{AuthFlow}</>
        )}
      </MainAppStack.Navigator>
    </NavigationContainer>
  );

  return RenderAppNavigations;
};

const ScreensWithoutBottomTab = (
  <MainAppStack.Group
    navigationKey="ScreensWithoutBottomTab"
    screenOptions={{
      title: '',
      headerBackTitle: '', //dont show the default back title
      headerBackVisible: true,
      headerShadowVisible: false,
    }}
  >
    <MainAppStack.Screen
      name="EditTodoScreen"
      component={EditTodoScreen}
      options={{
        headerShown: false,
      }}
    />

    <MainAppStack.Screen
      name="CreateNewCategoryScreen"
      component={CreateNewCategoryScreen}
      options={{
        headerShown: false,
        presentation: 'modal',
      }}
    />
    <MainAppStack.Screen
      name="EditProfileScreen"
      component={EditProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <MainAppStack.Screen
      name="ThemePickerScreen"
      component={ThemePickerScreen}
      options={{
        headerShown: false,
      }}
    />
    <MainAppStack.Screen
      name="LanguagePickerScreen"
      component={LanguagePickerScreen}
      options={{
        headerShown: false,
      }}
    />
  </MainAppStack.Group>
);
