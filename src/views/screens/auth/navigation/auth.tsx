import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MainStackParamList } from '../../../navigation/types';
import { LoginScreen, WelcomeScreen } from '..';

const MainAppStack = createNativeStackNavigator<MainStackParamList>();

export const AuthFlow = (
  <MainAppStack.Group
    navigationKey="Auth"
    screenOptions={{
      title: '',
      // headerBackTitleVisible: false,
      headerShadowVisible: false,
    }}
  >
    <MainAppStack.Screen
      name="WelcomeScreen"
      component={WelcomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <MainAppStack.Screen name="LoginScreen" component={LoginScreen} />
  </MainAppStack.Group>
);
