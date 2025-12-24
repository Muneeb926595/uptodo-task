/**
 * React Native Biometrics Adapter Implementation
 * Concrete implementation using react-native-biometrics library
 */

import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import {
  BiometricAdapter,
  BiometricAvailability,
  BiometricAuthResult,
  BiometricType,
} from './biometric-adapter';

export class ReactNativeBiometricsAdapter implements BiometricAdapter {
  private rnBiometrics: ReactNativeBiometrics;

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true, // Allow fallback to PIN/password
    });
  }

  async isSensorAvailable(): Promise<BiometricAvailability> {
    try {
      const { available, biometryType, error } =
        await this.rnBiometrics.isSensorAvailable();

      return {
        available,
        biometryType: this.mapBiometryType(biometryType),
        error,
      };
    } catch (error) {
      return {
        available: false,
        biometryType: BiometricType.NONE,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async authenticate(
    promptMessage: string,
    cancelButtonText: string = 'Cancel',
  ): Promise<BiometricAuthResult> {
    try {
      const { success, error } = await this.rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText,
      });

      return {
        success,
        error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  getBiometricTypeName(type: BiometricType): string {
    switch (type) {
      case BiometricType.FACE_ID:
        return 'Face ID';
      case BiometricType.TOUCH_ID:
        return 'Touch ID';
      case BiometricType.FINGERPRINT:
        return 'Fingerprint';
      case BiometricType.FACE:
        return 'Face Unlock';
      case BiometricType.IRIS:
        return 'Iris Scan';
      case BiometricType.NONE:
      default:
        return 'Biometric';
    }
  }

  /**
   * Map library-specific biometry types to our BiometricType enum
   */
  private mapBiometryType(
    biometryType:
      | (typeof BiometryTypes)[keyof typeof BiometryTypes]
      | undefined,
  ): BiometricType {
    if (!biometryType) {
      return BiometricType.NONE;
    }

    switch (biometryType) {
      case BiometryTypes.FaceID:
        return BiometricType.FACE_ID;
      case BiometryTypes.TouchID:
        return BiometricType.TOUCH_ID;
      case BiometryTypes.Biometrics:
        return BiometricType.FINGERPRINT;
      default:
        return BiometricType.NONE;
    }
  }
}
