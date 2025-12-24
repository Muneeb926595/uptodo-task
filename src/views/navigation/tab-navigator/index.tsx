import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme';
import { AppIcon } from '../../components/icon';
import { AppIconName, AppIconSize } from '../../components/icon/types';
import { Animated, TouchableOpacity, View } from 'react-native';
import { MainBottomTabsParamList, MainStackParamList } from '../types';
import { LocaleProvider } from '../../../services/localisation';
import { Layout } from '../../../globals';
import { styles } from './styles';
import { getCommonBottomSheetStyle } from '../../components/bottom-sheet-wrapper/styles';
import { magicSheet } from 'react-native-magic-sheet';
import { CreateTodoBottomSheet } from '../../screens/todo';
import {
  TodoListingScreen,
  CalendarScreen,
} from '../../screens/todo';
import { FocusScreen } from '../../screens/focus';
import { ProfileSettingsScreen } from '../../screens/profile';
import { useEffect, useRef } from 'react';
import { ComponentType } from 'react';

const MainTabs = createBottomTabNavigator<MainBottomTabsParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Generic stack navigator creator to avoid repetition
const createStackNavigator = (
  screenName: string,
  component: ComponentType<any>,
) => {
  const StackNavigator = () => (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={screenName as any}
        component={component}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
  return StackNavigator;
};

const HomeStack = createStackNavigator('TodoListingScreen', TodoListingScreen);
const CalendarStack = createStackNavigator('CalendarScreen', CalendarScreen);
const FocusStack = createStackNavigator('FocusScreen', FocusScreen);
const ProfileStack = createStackNavigator(
  'ProfileScreen',
  ProfileSettingsScreen,
);

const AddButton = () => {
  const { theme } = useTheme();
  const glowAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 30,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 15,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    glow.start();

    return () => {
      glow.stop();
    };
  }, []);

  const handleOpenSheet = async () => {
    await magicSheet.show(() => <CreateTodoBottomSheet />, {
      ...getCommonBottomSheetStyle(theme.colors.surface['DEFAULT']),
      snapPoints: [Layout.heightPercentageToDP(54)],
      android_keyboardInputMode: 'adjustResize',
      keyboardBehavior: 'interactive',
      keyboardBlurBehavior: 'restore',
    });
  };

  return (
    <View style={styles.addButtonContainer}>
      <Animated.View
        style={[
          styles.floatingButton,
          {
            shadowRadius: glowAnim,
            elevation: glowAnim,
          },
        ]}
      >
        <TouchableOpacity onPress={handleOpenSheet}>
          <AppIcon
            name={AppIconName.add}
            iconSize={AppIconSize.xlarge}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Tab configuration to avoid tight coupling
type TabConfig = {
  name: keyof MainBottomTabsParamList;
  component: ComponentType<any>;
  icon: AppIconName;
  labelKey: string;
};

const TAB_CONFIG: TabConfig[] = [
  {
    name: 'Home',
    component: HomeStack,
    icon: AppIconName.homeTab,
    labelKey: LocaleProvider.IDs.label.index,
  },
  {
    name: 'Calendar',
    component: CalendarStack,
    icon: AppIconName.calendar,
    labelKey: LocaleProvider.IDs.label.calendar,
  },
  {
    name: 'Focus',
    component: FocusStack,
    icon: AppIconName.clock,
    labelKey: LocaleProvider.IDs.label.focus,
  },
  {
    name: 'Profile',
    component: ProfileStack,
    icon: AppIconName.user,
    labelKey: LocaleProvider.IDs.label.profile,
  },
];

const renderTabIcon = (iconName: AppIconName, color: string) => (
  <AppIcon name={iconName} iconSize={AppIconSize.medium} color={color} />
);

export const TabsNavigator = () => {
  const { theme } = useTheme();

  return (
    <MainTabs.Navigator
      id={undefined}
      screenOptions={{
        headerShown: true,
        lazy: true,
        tabBarActiveTintColor: theme.colors.brand.DEFAULT,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: {
          backgroundColor: theme.colors.surface['100'],
          paddingTop: Layout.heightPercentageToDP(0.6),
        },
      }}
    >
      {TAB_CONFIG.slice(0, 2).map(tab => (
        <MainTabs.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            headerShown: false,
            tabBarLabel: LocaleProvider.formatMessage(tab.labelKey),
            tabBarIcon: ({ color }) => renderTabIcon(tab.icon, color),
          }}
        />
      ))}
      <MainTabs.Screen
        name="Add"
        component={() => null}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarButton: () => <AddButton />,
        }}
      />
      {TAB_CONFIG.slice(2).map(tab => (
        <MainTabs.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            headerShown: false,
            tabBarLabel: LocaleProvider.formatMessage(tab.labelKey),
            tabBarIcon: ({ color }) => renderTabIcon(tab.icon, color),
          }}
        />
      ))}
    </MainTabs.Navigator>
  );
};
