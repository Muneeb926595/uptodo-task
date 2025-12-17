import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainStackParamList = {
  LoginScreen: undefined;
  WelcomeScreen: undefined;

  Tabs: undefined;

  // Tabs screens
  HomeScreen: undefined;
  CalendarScreen: undefined;
  FocusScreen: undefined;
  ProfileScreen: undefined;

  // Categories screens
  CategoriesScreen: undefined;
  CreateNewCategoryScreen: undefined;
};

export type MainBottomTabsParamList = {
  Home: undefined;
  Calendar: undefined;
  Add: undefined;
  Focus: undefined;
  Profile: undefined;
};

export type ScreenProps<RouteName extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, RouteName>;

type AllParamsList = MainStackParamList & MainBottomTabsParamList;

export type TabScreenProps<RouteName extends keyof AllParamsList> =
  CompositeScreenProps<
    BottomTabScreenProps<
      MainBottomTabsParamList,
      Exclude<RouteName, keyof MainStackParamList>
    >,
    NativeStackScreenProps<
      MainStackParamList,
      Exclude<RouteName, keyof MainBottomTabsParamList>
    >
  >;
