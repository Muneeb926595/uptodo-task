/**
 * React Native Biometrics Adapter Test Suite
 *
 * Tests the adapter implementation for react-native-biometrics library
 */

import ReactNativeBiometrics, {
  BiometryType,
  BiometryTypes,
} from 'react-native-biometrics';
import { ReactNativeBiometricsAdapter } from '../react-native-biometrics-adapter';
import { BiometricType } from '../biometric-adapter';

// Mock the react-native-biometrics library
jest.mock('react-native-biometrics');

describe('ReactNativeBiometricsAdapter', () => {
  let adapter: ReactNativeBiometricsAdapter;
  let mockRNBiometrics: jest.Mocked<ReactNativeBiometrics>;

  beforeEach(() => {
    // Create mock instance
    mockRNBiometrics = {
      isSensorAvailable: jest.fn(),
      simplePrompt: jest.fn(),
      createKeys: jest.fn(),
      deleteKeys: jest.fn(),
      biometricKeysExist: jest.fn(),
      createSignature: jest.fn(),
    } as any;

    // Mock the constructor to return our mock instance
    (ReactNativeBiometrics as jest.Mock).mockImplementation(
      () => mockRNBiometrics,
    );

    adapter = new ReactNativeBiometricsAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize ReactNativeBiometrics with device credentials enabled', () => {
      // Act
      new ReactNativeBiometricsAdapter();

      // Assert
      expect(ReactNativeBiometrics).toHaveBeenCalledWith({
        allowDeviceCredentials: true,
      });
    });
  });

  describe('isSensorAvailable', () => {
    it('should return available with Face ID', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });

      // Act
      const result = await adapter.isSensorAvailable();

      // Assert
      expect(result).toEqual({
        available: true,
        biometryType: BiometricType.FACE_ID,
        error: undefined,
      });
    });

    it('should return available with Touch ID', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.TOUCH_ID,
      });

      // Act
      const result = await adapter.isSensorAvailable();

      // Assert
      expect(result).toEqual({
        available: true,
        biometryType: BiometricType.TOUCH_ID,
        error: undefined,
      });
    });

    it('should return available with Biometrics (Fingerprint)', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FINGERPRINT,
      });

      // Act
      const result = await adapter.isSensorAvailable();

      // Assert
      expect(result).toEqual({
        available: true,
        biometryType: BiometricType.FINGERPRINT,
        error: undefined,
      });
    });

    it('should return not available when sensor is not available', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: undefined,
        error: 'Biometrics not enrolled',
      });

      // Act
      const result = await adapter.isSensorAvailable();

      // Assert
      expect(result).toEqual({
        available: false,
        biometryType: BiometricType.NONE,
        error: 'Biometrics not enrolled',
      });
    });

    it('should map undefined biometry type to NONE', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: undefined,
      });

      // Act
      const result = await adapter.isSensorAvailable();

      // Assert
      expect(result.biometryType).toBe(BiometricType.NONE);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockRejectedValue(
        new Error('Hardware error'),
      );

      // Act
      const result = await adapter.isSensorAvailable();

      // Assert
      expect(result).toEqual({
        available: false,
        biometryType: BiometricType.NONE,
        error: 'Hardware error',
      });
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockRejectedValue('String error');

      // Act
      const result = await adapter.isSensorAvailable();

      // Assert
      expect(result).toEqual({
        available: false,
        biometryType: BiometricType.NONE,
        error: 'Unknown error',
      });
    });
  });

  describe('authenticate', () => {
    it('should authenticate successfully with default cancel button', async () => {
      // Arrange
      mockRNBiometrics.simplePrompt.mockResolvedValue({
        success: true,
      });

      // Act
      const result = await adapter.authenticate('Authenticate to continue');

      // Assert
      expect(mockRNBiometrics.simplePrompt).toHaveBeenCalledWith({
        promptMessage: 'Authenticate to continue',
        cancelButtonText: 'Cancel',
      });
      expect(result).toEqual({
        success: true,
        error: undefined,
      });
    });

    it('should authenticate successfully with custom cancel button', async () => {
      // Arrange
      mockRNBiometrics.simplePrompt.mockResolvedValue({
        success: true,
      });

      // Act
      const result = await adapter.authenticate(
        'Verify your identity',
        'Go Back',
      );

      // Assert
      expect(mockRNBiometrics.simplePrompt).toHaveBeenCalledWith({
        promptMessage: 'Verify your identity',
        cancelButtonText: 'Go Back',
      });
      expect(result.success).toBe(true);
    });

    it('should return error when authentication fails', async () => {
      // Arrange
      mockRNBiometrics.simplePrompt.mockResolvedValue({
        success: false,
        error: 'Authentication failed',
      });

      // Act
      const result = await adapter.authenticate('Authenticate');

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Authentication failed',
      });
    });

    it('should handle user cancellation', async () => {
      // Arrange
      mockRNBiometrics.simplePrompt.mockResolvedValue({
        success: false,
        error: 'User cancelled',
      });

      // Act
      const result = await adapter.authenticate('Authenticate');

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'User cancelled',
      });
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      mockRNBiometrics.simplePrompt.mockRejectedValue(
        new Error('Biometric sensor busy'),
      );

      // Act
      const result = await adapter.authenticate('Authenticate');

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Biometric sensor busy',
      });
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockRNBiometrics.simplePrompt.mockRejectedValue('Unknown failure');

      // Act
      const result = await adapter.authenticate('Authenticate');

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Authentication failed',
      });
    });
  });

  describe('getBiometricTypeName', () => {
    it('should return "Face ID" for FACE_ID type', () => {
      // Act
      const name = adapter.getBiometricTypeName(BiometricType.FACE_ID);

      // Assert
      expect(name).toBe('Face ID');
    });

    it('should return "Touch ID" for TOUCH_ID type', () => {
      // Act
      const name = adapter.getBiometricTypeName(BiometricType.TOUCH_ID);

      // Assert
      expect(name).toBe('Touch ID');
    });

    it('should return "Fingerprint" for FINGERPRINT type', () => {
      // Act
      const name = adapter.getBiometricTypeName(BiometricType.FINGERPRINT);

      // Assert
      expect(name).toBe('Fingerprint');
    });

    it('should return "Face Unlock" for FACE type', () => {
      // Act
      const name = adapter.getBiometricTypeName(BiometricType.FACE);

      // Assert
      expect(name).toBe('Face Unlock');
    });

    it('should return "Iris Scan" for IRIS type', () => {
      // Act
      const name = adapter.getBiometricTypeName(BiometricType.IRIS);

      // Assert
      expect(name).toBe('Iris Scan');
    });

    it('should return "Biometric" for NONE type', () => {
      // Act
      const name = adapter.getBiometricTypeName(BiometricType.NONE);

      // Assert
      expect(name).toBe('Biometric');
    });
  });

  describe('mapBiometryType', () => {
    it('should map all BiometryTypes correctly', async () => {
      // Test FaceID
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });
      let result = await adapter.isSensorAvailable();
      expect(result.biometryType).toBe(BiometricType.FACE_ID);

      // Test TouchID
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.TOUCH_ID,
      });
      result = await adapter.isSensorAvailable();
      expect(result.biometryType).toBe(BiometricType.TOUCH_ID);

      // Test Biometrics (generic fingerprint)
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FINGERPRINT,
      });
      result = await adapter.isSensorAvailable();
      expect(result.biometryType).toBe(BiometricType.FINGERPRINT);

      // Test undefined/unknown
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: 'UnknownType' as any,
      });
      result = await adapter.isSensorAvailable();
      expect(result.biometryType).toBe(BiometricType.NONE);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete authentication flow', async () => {
      // Arrange - Check sensor first
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });

      // Act
      const availability = await adapter.isSensorAvailable();

      // Assert sensor is available
      expect(availability.available).toBe(true);
      expect(availability.biometryType).toBe(BiometricType.FACE_ID);

      // Arrange - Authenticate
      mockRNBiometrics.simplePrompt.mockResolvedValue({
        success: true,
      });

      // Act
      const authResult = await adapter.authenticate(
        `Authenticate with ${adapter.getBiometricTypeName(
          availability.biometryType,
        )}`,
      );

      // Assert authentication succeeded
      expect(authResult.success).toBe(true);
      expect(mockRNBiometrics.simplePrompt).toHaveBeenCalledWith({
        promptMessage: 'Authenticate with Face ID',
        cancelButtonText: 'Cancel',
      });
    });

    it('should handle unavailable sensor gracefully', async () => {
      // Arrange
      mockRNBiometrics.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: undefined,
        error: 'No biometric hardware',
      });

      // Act
      const availability = await adapter.isSensorAvailable();

      // Assert
      expect(availability.available).toBe(false);
      expect(availability.biometryType).toBe(BiometricType.NONE);
      expect(availability.error).toBe('No biometric hardware');

      // Should get a generic name for NONE type
      const typeName = adapter.getBiometricTypeName(availability.biometryType);
      expect(typeName).toBe('Biometric');
    });
  });
});
