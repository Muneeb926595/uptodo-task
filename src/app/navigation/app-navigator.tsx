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

const MainAppStack = createNativeStackNavigator<MainStackParamList>();

export const AppNavigator = () => {
  const routeNameRef = useRef<any>(null);
  const { active } = useTheme();

  useEffect(() => {
    hideSplash();
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
          <>{AuthFlow}</>
        ) : !true ? (
          <>{AuthFlow}</>
        ) : (
          <>
            {/* <MainAppStack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{ headerShown: false }} />
            {ProfileFlow}
            {RxFlow}
            {PharmacyFlow}
            {SettingsFlow}
            {SupportFlow} */}
          </>
        )}
      </MainAppStack.Navigator>
    </NavigationContainer>
  );
};
