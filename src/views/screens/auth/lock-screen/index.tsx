import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { AppText } from '../../../../views/components/text';
import { AppIcon } from '../../../../views/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../views/components/icon/types';
import { Colors } from '../../../../theme';
import { biometricService } from '../../../../services/biometric';
import { LocaleProvider } from '../../../../services/localisation';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const [biometricType, setBiometricType] = useState<string>('Biometric');
  const [error, setError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    loadBiometricType();
    // Automatically prompt on mount
    handleUnlock();
  }, []);

  const loadBiometricType = async () => {
    const type = await biometricService.getBiometricTypeName();
    setBiometricType(type);
  };

  const handleUnlock = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setError('');

    const result = await biometricService.authenticate(
      `Unlock UpTodo with ${biometricType}`,
      false,
    );

    if (result.success) {
      onUnlock();
    } else {
      setError(result.error || 'Authentication failed. Please try again.');
    }

    setIsAuthenticating(false);
  };

  const getIconName = () => {
    if (biometricType === 'Face ID') return AppIconName.show;
    if (biometricType === 'Touch ID' || biometricType.includes('Fingerprint')) {
      return AppIconName.flag;
    }
    return AppIconName.hide;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <AppIcon
          name={getIconName()}
          iconSize={AppIconSize.huge}
          color={Colors.brand.DEFAULT}
        />
      </View>

      <AppText style={styles.title}>
        {LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.upTodoIsLocked,
        )}
      </AppText>
      <AppText style={styles.subtitle}>
        Use {biometricType} to unlock and access your tasks
      </AppText>

      <TouchableOpacity
        style={styles.unlockButton}
        onPress={handleUnlock}
        disabled={isAuthenticating}
        activeOpacity={0.7}
      >
        <AppText style={styles.unlockButtonText}>
          {isAuthenticating
            ? 'Authenticating...'
            : `Unlock with ${biometricType}`}
        </AppText>
      </TouchableOpacity>

      {error && <AppText style={styles.errorText}>{error}</AppText>}
    </SafeAreaView>
  );
};
