import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { AppText } from '../../../../views/components/text';
import { AppIcon } from '../../../../views/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../views/components/icon/types';
import { useTheme, themeMetadata, UnistylesRuntime } from '../../../../theme';
import { profileRepository } from '../../../../repository/profile';
import { navigationRef } from '../../../navigation';
import { LocaleProvider } from '../../../../services/localisation';
import {
  useProfile,
  useUpdateProfile,
  useAppLockStatus,
} from '../../../../react-query/profile';
import {
  ProfileHeader,
  SecuritySection,
  DataManagementSection,
} from '../components';

export const ProfileSettingsScreen = () => {
  const { theme } = useTheme();
  const currentTheme = UnistylesRuntime.themeName as
    | 'purpleDream'
    | 'oceanBlue'
    | 'forestGreen'
    | 'sunsetOrange'
    | 'rosePink';

  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: appLockEnabled = false } = useAppLockStatus();
  const updateProfileMutation = useUpdateProfile();

  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    if (appLockEnabled) {
      profileRepository.getBiometricType().then(type => {
        if (type) setBiometricType(type);
      });
    }
  }, [appLockEnabled]);

  const handleAvatarChange = (uri: string) => {
    updateProfileMutation.mutate({ avatar: uri });
  };

  const handleEditProfile = () => {
    navigationRef.navigate('EditProfileScreen');
  };

  const handleThemePicker = () => {
    navigationRef.navigate('ThemePickerScreen');
  };

  const handleLanguagePicker = () => {
    navigationRef.navigate('LanguagePickerScreen');
  };

  const handleLogout = () => {
    Alert.alert(
      LocaleProvider.formatMessage(LocaleProvider.IDs.label.clearProfileData),
      LocaleProvider.formatMessage(
        LocaleProvider.IDs.message.clearProfileDataConfirm,
      ),
      [
        {
          text: LocaleProvider.formatMessage(LocaleProvider.IDs.general.cancel),
          style: 'cancel',
        },
        {
          text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.clear),
          style: 'destructive',
          onPress: async () => {
            try {
              await profileRepository.deleteProfile();
              await profileRepository.disableAppLock();

              // Close app - user will see profile setup on next launch
              Alert.alert(
                LocaleProvider.formatMessage(
                  LocaleProvider.IDs.message.profileCleared,
                ),
                LocaleProvider.formatMessage(
                  LocaleProvider.IDs.message.profileClearedMessage,
                ),
                [
                  {
                    text: LocaleProvider.formatMessage(
                      LocaleProvider.IDs.label.ok,
                    ),
                  },
                ],
              );
            } catch (error) {
              Alert.alert(
                LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
                LocaleProvider.formatMessage(
                  LocaleProvider.IDs.message.failedToClearProfileData,
                ),
              );
            }
          },
        },
      ],
    );
  };

  if (loadingProfile) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.loadingContainer}>
          <AppText>
            {LocaleProvider.formatMessage(LocaleProvider.IDs.label.loading)}
          </AppText>
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
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          theme={theme}
          styles={styles}
          onAvatarChange={handleAvatarChange}
        />

        {/* Account Settings */}
        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>
            {LocaleProvider.formatMessage(LocaleProvider.IDs.label.account)}
          </AppText>

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
                <AppText style={styles.settingTitle}>
                  {LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.editProfile,
                  )}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {LocaleProvider.formatMessage(
                    LocaleProvider.IDs.message.changeYourNameAndEmail,
                  )}
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
          <AppText style={styles.sectionHeader}>
            {LocaleProvider.formatMessage(LocaleProvider.IDs.label.appearance)}
          </AppText>

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
                <AppText style={styles.settingTitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.label.theme)}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {themeMetadata[currentTheme]?.name ||
                    LocaleProvider.formatMessage(
                      LocaleProvider.IDs.message.selectTheme,
                    )}
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

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLanguagePicker}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <AppIcon
                name={AppIconName.announcement}
                iconSize={AppIconSize.medium}
                color={theme.colors.brand.DEFAULT}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <AppText style={styles.settingTitle}>
                  {LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.language,
                  )}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {LocaleProvider.formatMessage(
                    LocaleProvider.IDs.message.chooseAppLanguage,
                  )}
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
        <SecuritySection
          appLockEnabled={appLockEnabled}
          biometricType={biometricType}
          theme={theme}
          styles={styles}
          onBiometricTypeChange={setBiometricType}
        />

        {/* Data Management */}
        <DataManagementSection theme={theme} styles={styles} />

        {/* Danger Zone */}
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
            <AppText style={styles.logoutText}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.clearProfileData,
              )}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
