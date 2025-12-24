/**
 * Biometric Adapter Interface
 * Abstract interface for biometric authentication operations
 */

export enum BiometricType {
  NONE = 'None',
  TOUCH_ID = 'TouchID',
  FACE_ID = 'FaceID',
  FINGERPRINT = 'Biometrics',
  FACE = 'Face',
  IRIS = 'Iris',
}

export interface BiometricAvailability {
  available: boolean;
  biometryType: BiometricType;
  error?: string;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export interface BiometricAdapter {
  /**
   * Check if biometric authentication is available on the device
   */
  isSensorAvailable(): Promise<BiometricAvailability>;

  /**
   * Prompt user for biometric authentication
   * @param promptMessage - Message to show in the biometric prompt
   * @param cancelButtonText - Text for cancel button (Android)
   */
  authenticate(
    promptMessage: string,
    cancelButtonText?: string,
  ): Promise<BiometricAuthResult>;

  /**
   * Get a user-friendly name for the biometric type
   */
  getBiometricTypeName(type: BiometricType): string;
}
