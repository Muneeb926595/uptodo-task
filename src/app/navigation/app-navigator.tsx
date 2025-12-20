import React, { useEffect, useRef, useState } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from './navigation-utils';
import { MainStackParamList } from './types';
import { AuthFlow } from '../../modules/auth/view/navigation/auth';
import { hideSplash } from 'react-native-splash-view';
import { useTheme, UnistylesRuntime } from '../theme';
import { TabsNavigator } from './tab-navigator';
import { notificationService } from '../../modules/services/notifications';
import { todoRepository } from '../../modules/todo/repository';
import { EditTodoScreen } from '../../modules/todo/view/screens';
import { CreateNewCategoryScreen } from '../../modules/categories/view/screens/create-new-category-screen';
import { focusRepository } from '../../modules/focus/repository';
import { useFirstTimeAppOpen } from '../hooks';
import { Conditional } from '../components/conditional';
import { OnboardingScreen } from '../../modules/auth/view/screens/onboarding-screen';
import { StorageKeys, storageService } from '../../modules/services/storage';
import {
  ProfileSetupScreen,
  EditProfileScreen,
  ThemePickerScreen,
} from '../../modules/profile/view/screens';
import { profileRepository } from '../../modules/profile/repository/profile-repository';
import { LockScreen } from '../screens/lock-screen';
import { biometricService } from '../../modules/services/biometric';

const MainAppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = () => {
  const routeNameRef = useRef<any>(null);
  const currentTheme = UnistylesRuntime.themeName;

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

    // Initialize services
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
  </MainAppStack.Group>
);
