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
import { useTheme } from '../theme/provider';
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

const MainAppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = () => {
  const routeNameRef = useRef<any>(null);
  const { active } = useTheme();

  const isFirstTime = useFirstTimeAppOpen();
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  useEffect(() => {
    // Only hide splash once we know if it's first time or not
    if (isFirstTime !== null) {
      hideSplash();
    }

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
  }, [isFirstTime]);

  // Show nothing while checking first-time status
  if (isFirstTime === null) {
    return null;
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
      theme={active === 'dark' ? DarkTheme : DefaultTheme}
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

  return (
    <Conditional
      ifTrue={isFirstTime && showOnboarding}
      elseChildren={RenderAppNavigations}
    >
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
    </Conditional>
  );
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
  </MainAppStack.Group>
);
