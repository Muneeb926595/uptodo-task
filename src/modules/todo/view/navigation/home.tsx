import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MainStackParamList } from '../../../../app/navigation/types';
import { LoginScreen, WelcomeScreen } from '../screens';

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
