/**
 * Test Fixtures for Biometric Service
 *
 * Reusable mock data and helpers for biometric tests
 */

import {
  BiometricAdapter,
  BiometricAuthResult,
  BiometricAvailability,
  BiometricType,
} from '../../biometric-adapter';

/**
 * Mock successful availability responses
 */
export const mockAvailabilityResponses = {
  faceId: {
    available: true,
    biometryType: BiometricType.FACE_ID,
  } as BiometricAvailability,

  touchId: {
    available: true,
    biometryType: BiometricType.TOUCH_ID,
  } as BiometricAvailability,

  fingerprint: {
    available: true,
    biometryType: BiometricType.FINGERPRINT,
  } as BiometricAvailability,

  notAvailable: {
    available: false,
    biometryType: BiometricType.NONE,
    error: 'No biometric hardware detected',
  } as BiometricAvailability,

  notEnrolled: {
    available: false,
    biometryType: BiometricType.NONE,
    error: 'No biometric credentials enrolled',
  } as BiometricAvailability,
};

/**
 * Mock authentication results
 */
export const mockAuthResults = {
  success: {
    success: true,
  } as BiometricAuthResult,

  cancelled: {
    success: false,
    error: 'User cancelled authentication',
  } as BiometricAuthResult,

  failed: {
    success: false,
    error: 'Authentication failed',
  } as BiometricAuthResult,

  lockout: {
    success: false,
    error: 'Too many attempts. Biometric authentication is locked.',
  } as BiometricAuthResult,
};

/**
 * Create a mock biometric adapter with configurable behavior
 */
export const createMockBiometricAdapter = (config?: {
  availability?: BiometricAvailability;
  authResult?: BiometricAuthResult;
}): jest.Mocked<BiometricAdapter> => {
  return {
    isSensorAvailable: jest
      .fn()
      .mockResolvedValue(
        config?.availability || mockAvailabilityResponses.faceId,
      ),
    authenticate: jest
      .fn()
      .mockResolvedValue(config?.authResult || mockAuthResults.success),
    getBiometricTypeName: jest.fn((type: BiometricType) => {
      const names: Record<BiometricType, string> = {
        [BiometricType.FACE_ID]: 'Face ID',
        [BiometricType.TOUCH_ID]: 'Touch ID',
        [BiometricType.FINGERPRINT]: 'Fingerprint',
        [BiometricType.FACE]: 'Face Recognition',
        [BiometricType.IRIS]: 'Iris Scanner',
        [BiometricType.NONE]: 'None',
      };
      return names[type] || 'Biometric';
    }),
  };
};
