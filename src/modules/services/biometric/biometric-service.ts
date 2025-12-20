/**
 * Biometric Service
 * High-level service for handling biometric authentication
 * Provides business logic layer over the adapter
 */

import { Alert, Platform } from 'react-native';
import {
  BiometricAdapter,
  BiometricType,
  BiometricAvailability,
  BiometricAuthResult,
} from './biometric-adapter';
import { ReactNativeBiometricsAdapter } from './react-native-biometrics-adapter';

class BiometricService {
  private adapter: BiometricAdapter;

  constructor(adapter: BiometricAdapter) {
    this.adapter = adapter;
  }

  /**
   * Check if biometric authentication is available and supported
   */
  async isAvailable(): Promise<boolean> {
    try {
      const { available } = await this.adapter.isSensorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get detailed information about biometric availability
   */
  async getAvailability(): Promise<BiometricAvailability> {
    return this.adapter.isSensorAvailable();
  }

  /**
   * Get the type of biometric authentication available
   */
  async getBiometricType(): Promise<BiometricType> {
    try {
      const { biometryType } = await this.adapter.isSensorAvailable();
      return biometryType;
    } catch (error) {
      console.error('Error getting biometric type:', error);
      return BiometricType.NONE;
    }
  }

  /**
   * Get user-friendly name for the biometric type
   */
  async getBiometricTypeName(): Promise<string> {
    const type = await this.getBiometricType();
    return this.adapter.getBiometricTypeName(type);
  }

  /**
   * Authenticate user with biometrics
   * @param promptMessage - Custom message to show in prompt
   * @param showErrorAlert - Whether to show alert on failure
   */
  async authenticate(
    promptMessage?: string,
    showErrorAlert: boolean = true,
  ): Promise<BiometricAuthResult> {
    try {
      // Check if biometrics available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        const errorMessage = 'Biometric authentication is not available';
        if (showErrorAlert) {
          this.showError('Biometric Unavailable', errorMessage);
        }
        return { success: false, error: errorMessage };
      }

      // Get biometric type for custom message
      const biometricName = await this.getBiometricTypeName();
      const message = promptMessage || `Unlock UpTodo with ${biometricName}`;

      // Authenticate
      const result = await this.adapter.authenticate(message, 'Cancel');

      // Handle errors
      if (!result.success && result.error && showErrorAlert) {
        this.showError('Authentication Failed', result.error);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';

      if (showErrorAlert) {
        this.showError('Authentication Error', errorMessage);
      }

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Prompt user to enable biometric authentication
   * Tests if biometric works before enabling
   */
  async promptToEnable(): Promise<boolean> {
    const isAvailable = await this.isAvailable();

    if (!isAvailable) {
      const biometricName = Platform.select({
        ios: 'Face ID or Touch ID',
        android: 'Biometric authentication',
        default: 'Biometric authentication',
      });

      Alert.alert(
        'Biometric Unavailable',
        `${biometricName} is not available on this device or not configured. Please set it up in your device settings.`,
        [{ text: 'OK' }],
      );
      return false;
    }

    // Test authentication before enabling
    const biometricName = await this.getBiometricTypeName();
    const result = await this.authenticate(
      `Verify ${biometricName} to enable app lock`,
      false,
    );

    if (!result.success) {
      Alert.alert(
        'Verification Failed',
        result.error || 'Could not verify biometric authentication',
        [{ text: 'OK' }],
      );
      return false;
    }

    return true;
  }

  /**
   * Show error alert to user
   */
  private showError(title: string, message: string): void {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  /**
   * Get platform-specific biometric setting instructions
   */
  getSetupInstructions(): string {
    if (Platform.OS === 'ios') {
      return 'Go to Settings > Face ID & Passcode or Touch ID & Passcode to set up biometric authentication.';
    } else {
      return 'Go to Settings > Security > Biometric authentication to set up fingerprint or face unlock.';
    }
  }
}

// Create and export singleton instance
export const biometricService = new BiometricService(
  new ReactNativeBiometricsAdapter(),
);
