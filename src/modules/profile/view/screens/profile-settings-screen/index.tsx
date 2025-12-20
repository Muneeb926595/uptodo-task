import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { AppText } from '../../../../../app/components/text';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import {
  useTheme,
  themeMetadata,
  UnistylesRuntime,
  setTheme,
} from '../../../../../app/theme';
import { profileRepository } from '../../../repository/profile-repository';
import { biometricService } from '../../../../services/biometric';
import { mediaService } from '../../../../services/media';
import { UserProfile } from '../../../types/profile.types';
import { navigationRef } from '../../../../../app/navigation';

export const ProfileSettingsScreen = () => {
  const { theme } = useTheme();
  const currentTheme = UnistylesRuntime.themeName as
    | 'purpleDream'
    | 'oceanBlue'
    | 'forestGreen'
    | 'sunsetOrange'
    | 'rosePink';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await profileRepository.getProfile();
      setProfile(userProfile);

      const lockEnabled = await profileRepository.isAppLockEnabled();
      setAppLockEnabled(lockEnabled);

      if (lockEnabled) {
        const type = await biometricService.getBiometricTypeName();
        setBiometricType(type);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAvatar = async () => {
    try {
      const result = await mediaService.pickImage({
        mediaType: 'photo',
        includeBase64: false,
      });

      if (result && result.uri) {
        const updated = await profileRepository.updateProfile({
          avatar: result.uri,
        });
        if (updated) {
          setProfile(updated);
        }
      }
    } catch (error) {
      console.error('Error changing avatar:', error);
      Alert.alert('Error', 'Failed to update avatar. Please try again.');
    }
  };

  const handleEditProfile = () => {
    navigationRef.navigate('EditProfileScreen');
  };

  const handleThemePicker = () => {
    navigationRef.navigate('ThemePickerScreen');
  };

  const handleToggleAppLock = async (value: boolean) => {
    if (value) {
      // Enable app lock
      const isAvailable = await biometricService.isAvailable();

      if (!isAvailable) {
        Alert.alert(
          'Biometric Unavailable',
          biometricService.getSetupInstructions(),
          [{ text: 'OK' }],
        );
        return;
      }

      // Test authentication
      const canEnable = await biometricService.promptToEnable();

      if (canEnable) {
        const type = await biometricService.getBiometricTypeName();
        await profileRepository.enableAppLock(type);
        setAppLockEnabled(true);
        setBiometricType(type);

        Alert.alert(
          'App Lock Enabled',
          `${type} will be required to unlock UpTodo.`,
          [{ text: 'OK' }],
        );
      }
    } else {
      // Disable app lock - require authentication first
      const result = await biometricService.authenticate(
        'Verify to disable app lock',
      );

      if (result.success) {
        await profileRepository.disableAppLock();
        setAppLockEnabled(false);
        setBiometricType('');

        Alert.alert('App Lock Disabled', 'Your app is no longer protected.', [
          { text: 'OK' },
        ]);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Clear Profile Data',
      'Are you sure you want to clear all profile data? This will not delete your todos.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await profileRepository.deleteProfile();
              await profileRepository.disableAppLock();

              // Close app - user will see profile setup on next launch
              Alert.alert(
                'Profile Cleared',
                'Profile data has been cleared. Please close and reopen the app to set up your profile again.',
                [{ text: 'OK' }],
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to clear profile data.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AppText>Loading...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={[styles.section, styles.profileSection]}>
          <View style={styles.avatarContainer}>
            {profile?.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <AppIcon
                name={AppIconName.user}
                iconSize={AppIconSize.huge}
                color={theme.colors.typography[300]}
                style={styles.avatarPlaceholder}
              />
            )}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleChangeAvatar}
              activeOpacity={0.7}
            >
              <AppIcon
                name={AppIconName.image}
                iconSize={AppIconSize.small}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
          <AppText style={styles.profileName}>
            {profile?.name || 'User'}
          </AppText>
          {profile?.email && (
            <AppText style={styles.profileEmail}>{profile.email}</AppText>
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Account</AppText>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <AppIcon
                name={AppIconName.user}
                iconSize={AppIconSize.medium}
                color={theme.colors.brand.DEFAULT}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <AppText style={styles.settingTitle}>Edit Profile</AppText>
                <AppText style={styles.settingSubtitle}>
                  Change your name and email
                </AppText>
              </View>
            </View>
            <AppIcon
              name={AppIconName.rightArrow}
              iconSize={AppIconSize.small}
              color={theme.colors.typography[300]}
              style={styles.settingChevron}
            />
          </TouchableOpacity>
        </View>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Appearance</AppText>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleThemePicker}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <AppIcon
                name={AppIconName.show}
                iconSize={AppIconSize.medium}
                color={theme.colors.brand.DEFAULT}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <AppText style={styles.settingTitle}>Theme</AppText>
                <AppText style={styles.settingSubtitle}>
                  {themeMetadata[currentTheme]?.name || 'Select theme'}
                </AppText>
              </View>
            </View>
            <AppIcon
              name={AppIconName.rightArrow}
              iconSize={AppIconSize.small}
              color={theme.colors.typography[300]}
              style={styles.settingChevron}
            />
          </TouchableOpacity>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Security</AppText>

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <AppIcon
                name={AppIconName.flag}
                iconSize={AppIconSize.medium}
                color={theme.colors.brand.DEFAULT}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <AppText style={styles.settingTitle}>App Lock</AppText>
                <AppText style={styles.settingSubtitle}>
                  {appLockEnabled
                    ? `Protected with ${biometricType}`
                    : 'Protect app with biometric'}
                </AppText>
              </View>
            </View>
            <Switch
              value={appLockEnabled}
              onValueChange={handleToggleAppLock}
              trackColor={{
                false: theme.colors.surface[100],
                true: theme.colors.brand.DEFAULT,
              }}
              thumbColor={theme.colors.white}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <AppIcon
              name={AppIconName.trash}
              iconSize={AppIconSize.medium}
              color={theme.colors.red}
            />
            <AppText style={styles.logoutText}>Clear Profile Data</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
