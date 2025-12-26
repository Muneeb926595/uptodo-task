import React from 'react';
import { View, Switch, Alert } from 'react-native';
import { profileRepository } from '../../../../repository';
import { biometricService } from '../../../../services/biometric';
import { LocaleProvider } from '../../../../services/localisation';
import { AppIcon, AppText } from '../../../components';
import { AppIconName, AppIconSize } from '../../../components/icon/types';

interface SecuritySectionProps {
  appLockEnabled: boolean;
  biometricType: string;
  theme: any;
  styles: any;
  onBiometricTypeChange: (type: string) => void;
}

export const SecuritySection = ({
  appLockEnabled,
  biometricType,
  theme,
  styles,
  onBiometricTypeChange,
}: SecuritySectionProps) => {
  const handleToggleAppLock = async (value: boolean) => {
    const result = await profileRepository.handleAppLockToggle(
      value,
      biometricService,
    );

    if (result.success) {
      onBiometricTypeChange(result.biometricType);

      if (value) {
        Alert.alert(
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.appLockEnabled,
          ),
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.appLockEnabledMessage,
            { type: result.biometricType },
          ),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
        );
      } else {
        Alert.alert(
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.appLockDisabled,
          ),
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.appLockDisabledMessage,
          ),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
        );
      }
    } else {
      if (result.reason === 'biometricUnavailable') {
        Alert.alert(
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.biometricUnavailable,
          ),
          result.instructions,
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
        );
      }
    }
  };

  return (
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
                ? LocaleProvider.formatMessage(
                    LocaleProvider.IDs.message.protectedWith,
                    { type: biometricType },
                  )
                : LocaleProvider.formatMessage(
                    LocaleProvider.IDs.message.protectAppWithBiometric,
                  )}
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
  );
};
