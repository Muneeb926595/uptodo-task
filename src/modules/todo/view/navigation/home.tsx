import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MainStackParamList } from '../../../../app/navigation/types';
import { HomeScreen } from '../screens';

const MainAppStack = createNativeStackNavigator<MainStackParamList>();

export const HomeFlow = (
  <MainAppStack.Group
    navigationKey="Home"
    screenOptions={{
      title: '',
      // headerBackTitleVisible: false,
      headerShadowVisible: false,
    }}
  >
    <MainAppStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
  </MainAppStack.Group>
);
