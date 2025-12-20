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
      Alert.alert('Error', 'Failed to update avatar. Please try again.');
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

  const handleExportTodos = async () => {
    try {
      setExportingData(true);
      const todos = await todoRepository.getAll();
      const categories = await categoriesRepository.getAll();

      if (todos.length === 0) {
        Alert.alert('No Todos', "You don't have any todos to export.", [
          { text: 'OK' },
        ]);
        return;
      }

      await importExportService.exportTodos(todos, categories);
    } catch (error: any) {
      Alert.alert('Export Failed', error.message || 'Failed to export todos');
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
        Alert.alert('Invalid Backup File', validation.errors.join('\n'), [
          { text: 'OK' },
        ]);
        return;
      }

      const summary = importExportService.getExportSummary(data);

      // Ask user for import strategy
      Alert.alert(
        'Import Todos',
        `${summary}\n\nHow would you like to import?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Merge',
            onPress: () => performImport(data, 'merge'),
          },
          {
            text: 'Replace All',
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
      Alert.alert('Import Failed', error.message || 'Failed to import todos');
    } finally {
      setImportingData(false);
    }
  };

  const confirmReplaceImport = (data: any) => {
    Alert.alert(
      'Replace All Todos?',
      'This will delete all your existing todos and replace them with the imported ones. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Replace All',
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

      let message = `Successfully imported ${todosResult.imported} todo(s)`;
      if (categoriesResult.imported > 0) {
        message += ` and ${categoriesResult.imported} category(ies)`;
      }
      if (totalSkipped > 0) {
        message += `\n${totalSkipped} item(s) skipped (already exist)`;
      }
      if (todosResult.errors > 0) {
        message += `\n${todosResult.errors} error(s) occurred`;
      }

      Alert.alert('Import Successful', message, [{ text: 'OK' }]);
    } catch (error: any) {
      Alert.alert('Import Failed', error.message || 'Failed to import todos');
    } finally {
      setImportingData(false);
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
                <AppText style={styles.settingTitle}>Language</AppText>
                <AppText style={styles.settingSubtitle}>
                  Choose app language
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
          <AppText style={styles.sectionHeader}>Data Management</AppText>

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
                <AppText style={styles.settingTitle}>Export Todos</AppText>
                <AppText style={styles.settingSubtitle}>
                  Backup your todos to a file
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
                <AppText style={styles.settingTitle}>Import Todos</AppText>
                <AppText style={styles.settingSubtitle}>
                  Restore todos from a backup
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
            <AppText style={styles.logoutText}>Clear Profile Data</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
