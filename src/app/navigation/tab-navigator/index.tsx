import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../../theme';
import { AppIcon } from '../../components/icon';
import { AppIconName, AppIconSize } from '../../components/icon/types';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from '../../components/text';
import { MainBottomTabsParamList, MainStackParamList } from '../types';
import { LocaleProvider } from '../../localisation/locale-provider';
import { Layout } from '../../globals';
import { HomeScreen } from '../../../modules/todo/view/screens';
import { styles } from './styles';
import { emit } from '../../utils/event-bus';
import { CommonBottomSheetStyle } from '../../components/bottom-sheet-wrapper/styles';
import { magicSheet } from 'react-native-magic-sheet';
import { CategoriesScreen } from '../../../modules/categories/view/screens';

const MainTabs = createBottomTabNavigator<MainBottomTabsParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const HomeStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
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
      component={() => {
        return (
          <View>
            <AppText>Calendar screen</AppText>
          </View>
        );
      }}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const FocusStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="FocusScreen"
      component={() => {
        return (
          <View>
            <AppText>Calendar screen</AppText>
          </View>
        );
      }}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="ProfileScreen"
      component={() => {
        return (
          <View>
            <AppText>Calendar screen</AppText>
          </View>
        );
      }}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const AddButton = () => {
  const handlePress = () => {
    emit('open-add-task');
  };

  return (
    <TouchableOpacity
      onPress={handleOpenCalender}
      style={styles.floatingButton}
    >
      <AppIcon
        name={AppIconName.add}
        iconSize={AppIconSize.xlarge}
        color={Colors.white}
      />
    </TouchableOpacity>
  );
};

const handleOpenCalender = async () => {
  await magicSheet.show(
    () => (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
      >
        <View
          style={{
            backgroundColor: '#3A3A3A',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 28,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          <TextInput
            placeholder="Do math homework"
            placeholderTextColor="#9CA3AF"
            style={{
              backgroundColor: '#2A2A2A',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: '#FFFFFF',
              fontSize: 16,
              marginBottom: 12,
            }}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor="#6B7280"
            style={[
              {
                backgroundColor: '#2A2A2A',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: '#FFFFFF',
                fontSize: 16,
                marginBottom: 12,
              },
            ]}
            multiline
          />
        </View>
      </KeyboardAvoidingView>
    ),
    {
      ...CommonBottomSheetStyle,
      snapPoints: [Layout.heightPercentageToDP(56)],
    },
  );
};

export const TabsNavigator = () => {
  return (
    <MainTabs.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: true,
        lazy: true,
        tabBarActiveTintColor: Colors.brand['DEFAULT'],
        tabBarInactiveTintColor: Colors.white,
        tabBarStyle: {
          backgroundColor: Colors.surface['100'],
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
        listeners={{
          tabPress: e => {
            handleOpenCalender();
          },
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
