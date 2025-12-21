import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { AppIcon } from '../../components/icon';
import { AppIconName, AppIconSize } from '../../components/icon/types';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/text';
import { MainBottomTabsParamList, MainStackParamList } from '../types';
import { LocaleProvider } from '../../localisation/locale-provider';
import { Layout } from '../../globals';
import { styles } from './styles';
import { getCommonBottomSheetStyle } from '../../components/bottom-sheet-wrapper/styles';
import { magicSheet } from 'react-native-magic-sheet';
import { CategoriesScreen } from '../../../modules/categories/view/screens';
import { CreateTodoBottomSheet } from '../../../modules/todo/view/components';
import {
  TodoListingScreen,
  CalendarScreen,
} from '../../../modules/todo/view/screens';
import { FocusScreen } from '../../../modules/focus/view/screens';
import { ProfileSettingsScreen } from '../../../modules/profile/view/screens';

const MainTabs = createBottomTabNavigator<MainBottomTabsParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const HomeStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="TodoListingScreen"
      component={TodoListingScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="CategoriesScreen"
      component={CategoriesScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const CalendarStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="CalendarScreen"
      component={CalendarScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const FocusStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="FocusScreen"
      component={FocusScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileSettingsScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const AddButton = () => {
  const { theme } = useTheme();
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
    <TouchableOpacity onPress={handleOpenSheet} style={styles.floatingButton}>
      <AppIcon
        name={AppIconName.add}
        iconSize={AppIconSize.xlarge}
        color={theme.colors.white}
      />
    </TouchableOpacity>
  );
};

export const TabsNavigator = () => {
  const { theme } = useTheme();
  return (
    <MainTabs.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: true,
        lazy: true,
        tabBarActiveTintColor: theme.colors.brand.DEFAULT,
        tabBarInactiveTintColor: theme.colors.white,
        tabBarStyle: {
          backgroundColor: theme.colors.surface['100'],
          paddingTop: Layout.heightPercentageToDP(0.6),
        },
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return (
                <AppIcon
                  name={AppIconName.homeTab}
                  iconSize={AppIconSize.medium}
                  color={color}
                />
              );
            case 'Calendar':
              return (
                <AppIcon
                  name={AppIconName.calendar}
                  iconSize={AppIconSize.medium}
                  color={color}
                />
              );
            case 'Focus':
              return (
                <AppIcon
                  name={AppIconName.clock}
                  iconSize={AppIconSize.medium}
                  color={color}
                />
              );
            case 'Profile':
              return (
                <AppIcon
                  name={AppIconName.user}
                  iconSize={AppIconSize.medium}
                  color={color}
                />
              );
            default:
              return '';
          }
        },
      })}
    >
      <MainTabs.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: LocaleProvider.formatMessage(
            LocaleProvider.IDs.label.index,
          ),
        }}
      />
      <MainTabs.Screen
        name="Calendar"
        component={CalendarStack}
        options={{
          headerShown: false,
          tabBarLabel: LocaleProvider.formatMessage(
            LocaleProvider.IDs.label.calendar,
          ),
        }}
      />
      <MainTabs.Screen
        name="Add"
        component={() => {
          return null;
        }}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarButton: () => <AddButton />,
        }}
      />
      <MainTabs.Screen
        name="Focus"
        component={FocusStack}
        options={{
          headerShown: false,
          tabBarLabel: LocaleProvider.formatMessage(
            LocaleProvider.IDs.label.focus,
          ),
        }}
      />
      <MainTabs.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: LocaleProvider.formatMessage(
            LocaleProvider.IDs.label.profile,
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};
