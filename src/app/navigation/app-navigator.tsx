import React, { useEffect, useRef } from 'react';
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
import { EditTaskScreen } from '../../modules/todo/view/screens';
import { CreateNewCategoryScreen } from '../../modules/categories/view/screens/create-new-category-screen';

const MainAppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = () => {
  const routeNameRef = useRef<any>(null);
  const { active } = useTheme();

  useEffect(() => {
    hideSplash();

    (async () => {
      // Notifications
      await notificationService.ensurePermissions();

      const todos = await todoRepository.getAll();
      await notificationService.resyncAll(todos);
    })();
  }, []);

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

  return (
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
      name="EditTaskScreen"
      component={EditTaskScreen}
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
