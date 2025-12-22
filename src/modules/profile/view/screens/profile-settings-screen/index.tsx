import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from '@react-native-documents/picker';
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
import { todoRepository } from '../../../../todo/repository';
import { categoriesRepository } from '../../../../categories/repository';
import { importExportService } from '../../../../services/import-export';
import { LocaleProvider } from '../../../../../app/localisation';

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
  const [exportingData, setExportingData] = useState(false);
  const [importingData, setImportingData] = useState(false);

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
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.failedToUpdateAvatar)
      );
    }
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

  const handleToggleAppLock = async (value: boolean) => {
    if (value) {
      // Enable app lock
      const isAvailable = await biometricService.isAvailable();

      if (!isAvailable) {
        Alert.alert(
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.biometricUnavailable),
          biometricService.getSetupInstructions(),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
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
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.appLockEnabled),
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.appLockEnabledMessage, { type }),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
        );
      }
    } else {
      // Disable app lock - require authentication first
      const result = await biometricService.authenticate(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.verifyToDisableAppLock),
      );

      if (result.success) {
        await profileRepository.disableAppLock();
        setAppLockEnabled(false);
        setBiometricType('');

        Alert.alert(
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.appLockDisabled),
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.appLockDisabledMessage),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }]
        );
      }
    }
  };

  const handleExportTodos = async () => {
    try {
      setExportingData(true);
      const todos = await todoRepository.getAll();
      const categories = await categoriesRepository.getAll();

      if (todos.length === 0) {
        Alert.alert(
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.noTodos),
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.noTodosToExport),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }]
        );
        return;
      }

      await importExportService.exportTodos(todos, categories);
    } catch (error: any) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.exportFailed),
        error.message || LocaleProvider.formatMessage(LocaleProvider.IDs.message.failedToExportTodos)
      );
    } finally {
      setExportingData(false);
    }
  };

  const handleImportTodos = async () => {
    try {
      // Pick a file
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });

      if (!result || result.length === 0) {
        return;
      }

      const file = result[0];
      const filePath = file.uri;

      setImportingData(true);

      // Import and validate
      const data = await importExportService.importTodos(filePath);
      const validation = importExportService.validateImportData(data);

      if (!validation.valid) {
        Alert.alert(
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.invalidBackupFile),
          validation.errors.join('\n'),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }]
        );
        return;
      }

      const summary = importExportService.getExportSummary(data);

      // Ask user for import strategy
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.importTodosTitle),
        `${summary}\n\n${LocaleProvider.formatMessage(LocaleProvider.IDs.message.howToImport)}`,
        [
          {
            text: LocaleProvider.formatMessage(LocaleProvider.IDs.general.cancel),
            style: 'cancel',
          },
          {
            text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.merge),
            onPress: () => performImport(data, 'merge'),
          },
          {
            text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.replaceAll),
            onPress: () => confirmReplaceImport(data),
            style: 'destructive',
          },
        ],
      );
    } catch (error: any) {
      // Check if user cancelled (error code for cancellation)
      if (
        error?.code === 'DOCUMENT_PICKER_CANCELED' ||
        error?.message?.includes('cancel')
      ) {
        // User cancelled
        return;
      }
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.importFailed),
        error.message || LocaleProvider.formatMessage(LocaleProvider.IDs.message.failedToImportTodos),
      );
    } finally {
      setImportingData(false);
    }
  };

  const confirmReplaceImport = (data: any) => {
    Alert.alert(
      LocaleProvider.formatMessage(LocaleProvider.IDs.message.replaceAllTodos),
      LocaleProvider.formatMessage(LocaleProvider.IDs.message.replaceAllTodosWarning),
      [
        {
          text: LocaleProvider.formatMessage(LocaleProvider.IDs.general.cancel),
          style: 'cancel',
        },
        {
          text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.replaceAll),
          style: 'destructive',
          onPress: () => performImport(data, 'replace'),
        },
      ],
    );
  };

  const performImport = async (data: any, strategy: 'merge' | 'replace') => {
    try {
      setImportingData(true);

      // Import categories first (if any)
      let categoriesResult = { imported: 0, skipped: 0 };
      if (data.categories && data.categories.length > 0) {
        categoriesResult = await categoriesRepository.importCategories(
          data.categories,
          strategy,
        );
      }

      // Import todos
      const todosResult = await todoRepository.importTodos(
        data.todos,
        strategy,
      );

      const totalImported = todosResult.imported + categoriesResult.imported;
      const totalSkipped = todosResult.skipped + categoriesResult.skipped;

      let message = LocaleProvider.formatMessage(
        LocaleProvider.IDs.message.successfullyImported,
        { count: todosResult.imported }
      );
      if (categoriesResult.imported > 0) {
        message += LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.andCategories,
          { count: categoriesResult.imported }
        );
      }
      if (totalSkipped > 0) {
        message += `\\n${LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.itemsSkipped,
          { count: totalSkipped }
        )}`;
      }
      if (todosResult.errors > 0) {
        message += `\\n${LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.errorsOccurred,
          { count: todosResult.errors }
        )}`;
      }

      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.importSuccessful),
        message,
        [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }]
      );
    } catch (error: any) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.importFailed),
        error.message || LocaleProvider.formatMessage(LocaleProvider.IDs.message.failedToImportTodos)
      );
    } finally {
      setImportingData(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      LocaleProvider.formatMessage(LocaleProvider.IDs.label.clearProfileData),
      LocaleProvider.formatMessage(LocaleProvider.IDs.message.clearProfileDataConfirm),
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
                LocaleProvider.formatMessage(LocaleProvider.IDs.message.profileCleared),
                LocaleProvider.formatMessage(LocaleProvider.IDs.message.profileClearedMessage),
                [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
              );
            } catch (error) {
              Alert.alert(
                LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
                LocaleProvider.formatMessage(LocaleProvider.IDs.message.failedToClearProfileData)
              );
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
          <AppText>{LocaleProvider.formatMessage(LocaleProvider.IDs.label.loading)}</AppText>
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
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.label.editProfile)}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.message.changeYourNameAndEmail)}
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
                  {themeMetadata[currentTheme]?.name || LocaleProvider.formatMessage(LocaleProvider.IDs.message.selectTheme)}
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
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.label.language)}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.message.chooseAppLanguage)}
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
          <AppText style={styles.sectionHeader}>
            {LocaleProvider.formatMessage(LocaleProvider.IDs.label.security)}
          </AppText>

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <AppIcon
                name={AppIconName.flag}
                iconSize={AppIconSize.medium}
                color={theme.colors.brand.DEFAULT}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <AppText style={styles.settingTitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.label.appLock)}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {appLockEnabled
                    ? LocaleProvider.formatMessage(LocaleProvider.IDs.message.protectedWith, { type: biometricType })
                    : LocaleProvider.formatMessage(LocaleProvider.IDs.message.protectAppWithBiometric)}
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
          <AppText style={styles.sectionHeader}>
            {LocaleProvider.formatMessage(LocaleProvider.IDs.label.dataManagement)}
          </AppText>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportTodos}
            activeOpacity={0.7}
            disabled={exportingData}
          >
            <View style={styles.settingItemLeft}>
              <AppIcon
                name={AppIconName.send}
                iconSize={AppIconSize.medium}
                color={theme.colors.brand.DEFAULT}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <AppText style={styles.settingTitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.label.exportTodos)}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.message.backupYourTodosToFile)}
                </AppText>
              </View>
            </View>
            {exportingData ? (
              <ActivityIndicator color={theme.colors.brand.DEFAULT} />
            ) : (
              <AppIcon
                name={AppIconName.rightArrow}
                iconSize={AppIconSize.small}
                color={theme.colors.typography[300]}
                style={styles.settingChevron}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleImportTodos}
            activeOpacity={0.7}
            disabled={importingData}
          >
            <View style={styles.settingItemLeft}>
              <AppIcon
                name={AppIconName.repeat}
                iconSize={AppIconSize.medium}
                color={theme.colors.brand.DEFAULT}
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <AppText style={styles.settingTitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.label.importTodos)}
                </AppText>
                <AppText style={styles.settingSubtitle}>
                  {LocaleProvider.formatMessage(LocaleProvider.IDs.message.restoreTodosFromBackup)}
                </AppText>
              </View>
            </View>
            {importingData ? (
              <ActivityIndicator color={theme.colors.brand.DEFAULT} />
            ) : (
              <AppIcon
                name={AppIconName.rightArrow}
                iconSize={AppIconSize.small}
                color={theme.colors.typography[300]}
                style={styles.settingChevron}
              />
            )}
          </TouchableOpacity>
        </View>

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
              {LocaleProvider.formatMessage(LocaleProvider.IDs.label.clearProfileData)}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
