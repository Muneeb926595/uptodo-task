/**
 * Biometric Service Test Suite
 *
 * Tests the BiometricService with a mock adapter.
 * Covers authentication flows, error handling, and platform-specific logic.
 */

import { Platform } from 'react-native';
import { BiometricService } from '../biometric-service';
import {
  BiometricAdapter,
  BiometricType,
  BiometricAvailability,
  BiometricAuthResult,
} from '../biometric-adapter';

// Mock Alert separately
const mockAlert = jest.fn();
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  default: { alert: mockAlert },
}));

// Import Alert after mocking
import { Alert } from 'react-native';
// Replace Alert.alert with our mock
(Alert as any).alert = mockAlert;

describe('BiometricService', () => {
  let biometricService: BiometricService;
  let mockAdapter: jest.Mocked<BiometricAdapter>;

  beforeEach(() => {
    // Create mock adapter
    mockAdapter = {
      isSensorAvailable: jest.fn(),
      authenticate: jest.fn(),
      getBiometricTypeName: jest.fn(),
    };

    // Initialize service with mock
    biometricService = new BiometricService(mockAdapter);

    // Clear mock
    mockAlert.mockClear();
  });

  describe('isAvailable', () => {
    it('should return true when biometric is available', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });

      // Act
      const result = await biometricService.isAvailable();

      // Assert
      expect(mockAdapter.isSensorAvailable).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when biometric is not available', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: BiometricType.NONE,
        error: 'No biometric hardware',
      });

      // Act
      const result = await biometricService.isAvailable();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when adapter throws error', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockRejectedValue(
        new Error('Sensor check failed'),
      );

      // Act
      const result = await biometricService.isAvailable();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getAvailability', () => {
    it('should return detailed availability info', async () => {
      // Arrange
      const availability: BiometricAvailability = {
        available: true,
        biometryType: BiometricType.TOUCH_ID,
      };
      mockAdapter.isSensorAvailable.mockResolvedValue(availability);

      // Act
      const result = await biometricService.getAvailability();

      // Assert
      expect(result).toEqual(availability);
    });
  });

  describe('getBiometricType', () => {
    it('should return Face ID type', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });

      // Act
      const result = await biometricService.getBiometricType();

      // Assert
      expect(result).toBe(BiometricType.FACE_ID);
    });

    it('should return Touch ID type', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.TOUCH_ID,
      });

      // Act
      const result = await biometricService.getBiometricType();

      // Assert
      expect(result).toBe(BiometricType.TOUCH_ID);
    });

    it('should return NONE when error occurs', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockRejectedValue(
        new Error('Sensor error'),
      );

      // Act
      const result = await biometricService.getBiometricType();

      // Assert
      expect(result).toBe(BiometricType.NONE);
    });
  });

  describe('getBiometricTypeName', () => {
    it('should return user-friendly name', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });
      mockAdapter.getBiometricTypeName.mockReturnValue('Face ID');

      // Act
      const result = await biometricService.getBiometricTypeName();

      // Assert
      expect(mockAdapter.getBiometricTypeName).toHaveBeenCalledWith(
        BiometricType.FACE_ID,
      );
      expect(result).toBe('Face ID');
    });
  });

  describe('authenticate', () => {
    beforeEach(() => {
      // Mock that biometric is available by default
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });
      mockAdapter.getBiometricTypeName.mockReturnValue('Face ID');
    });

    it('should authenticate successfully with default message', async () => {
      // Arrange
      const authResult: BiometricAuthResult = { success: true };
      mockAdapter.authenticate.mockResolvedValue(authResult);

      // Act
      const result = await biometricService.authenticate();

      // Assert
      expect(mockAdapter.authenticate).toHaveBeenCalledWith(
        'Unlock UpTodo with Face ID',
        'Cancel',
      );
      expect(result).toEqual(authResult);
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('should authenticate successfully with custom message', async () => {
      // Arrange
      const customMessage = 'Verify to continue';
      const authResult: BiometricAuthResult = { success: true };
      mockAdapter.authenticate.mockResolvedValue(authResult);

      // Act
      const result = await biometricService.authenticate(customMessage);

      // Assert
      expect(mockAdapter.authenticate).toHaveBeenCalledWith(
        customMessage,
        'Cancel',
      );
      expect(result).toEqual(authResult);
    });

    it('should return error when biometric is not available', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: BiometricType.NONE,
      });

      // Act
      const result = await biometricService.authenticate();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Biometric authentication is not available');
      expect(mockAlert).toHaveBeenCalledWith(
        'Biometric Unavailable',
        'Biometric authentication is not available',
        [{ text: 'OK' }],
      );
    });

    it('should not show alert when biometric unavailable and showErrorAlert is false', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: BiometricType.NONE,
      });

      // Act
      const result = await biometricService.authenticate(undefined, false);

      // Assert
      expect(result.success).toBe(false);
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('should handle authentication failure with error message', async () => {
      // Arrange
      const authResult: BiometricAuthResult = {
        success: false,
        error: 'Authentication failed',
      };
      mockAdapter.authenticate.mockResolvedValue(authResult);

      // Act
      const result = await biometricService.authenticate();

      // Assert
      expect(result).toEqual(authResult);
      expect(mockAlert).toHaveBeenCalledWith(
        'Authentication Failed',
        'Authentication failed',
        [{ text: 'OK' }],
      );
    });

    it('should not show alert on failure when showErrorAlert is false', async () => {
      // Arrange
      const authResult: BiometricAuthResult = {
        success: false,
        error: 'User cancelled',
      };
      mockAdapter.authenticate.mockResolvedValue(authResult);

      // Act
      const result = await biometricService.authenticate(undefined, false);

      // Assert
      expect(result).toEqual(authResult);
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('should handle adapter errors gracefully', async () => {
      // Arrange
      mockAdapter.authenticate.mockRejectedValue(
        new Error('Native module error'),
      );

      // Act
      const result = await biometricService.authenticate();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Native module error');
      expect(mockAlert).toHaveBeenCalled();
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockAdapter.authenticate.mockRejectedValue('String error');

      // Act
      const result = await biometricService.authenticate();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed');
    });
  });

  describe('promptToEnable', () => {
    it('should return true when authentication succeeds', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });
      mockAdapter.getBiometricTypeName.mockReturnValue('Face ID');
      mockAdapter.authenticate.mockResolvedValue({ success: true });

      // Act
      const result = await biometricService.promptToEnable();

      // Assert
      expect(result).toBe(true);
      expect(mockAdapter.authenticate).toHaveBeenCalledWith(
        'Verify Face ID to enable app lock',
        'Cancel',
      );
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('should return false when biometric is not available', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: false,
        biometryType: BiometricType.NONE,
      });

      // Act
      const result = await biometricService.promptToEnable();

      // Assert
      expect(result).toBe(false);
      expect(mockAlert).toHaveBeenCalled();
      expect(mockAdapter.authenticate).not.toHaveBeenCalled();
    });

    it('should return false when authentication fails', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.TOUCH_ID,
      });
      mockAdapter.getBiometricTypeName.mockReturnValue('Touch ID');
      mockAdapter.authenticate.mockResolvedValue({
        success: false,
        error: 'User cancelled',
      });

      // Act
      const result = await biometricService.promptToEnable();

      // Assert
      expect(result).toBe(false);
      expect(mockAlert).toHaveBeenCalledWith(
        'Verification Failed',
        'User cancelled',
        [{ text: 'OK' }],
      );
    });

    it('should show generic message when no error provided', async () => {
      // Arrange
      mockAdapter.isSensorAvailable.mockResolvedValue({
        available: true,
        biometryType: BiometricType.FACE_ID,
      });
      mockAdapter.getBiometricTypeName.mockReturnValue('Face ID');
      mockAdapter.authenticate.mockResolvedValue({
        success: false,
      });

      // Act
      const result = await biometricService.promptToEnable();

      // Assert
      expect(result).toBe(false);
      expect(mockAlert).toHaveBeenCalledWith(
        'Verification Failed',
        'Could not verify biometric authentication',
        [{ text: 'OK' }],
      );
    });
  });

  describe('getSetupInstructions', () => {
    it('should return iOS instructions', () => {
      // Arrange
      Platform.OS = 'ios';

      // Act
      const result = biometricService.getSetupInstructions();

      // Assert
      expect(result).toContain('Face ID & Passcode');
      expect(result).toContain('Touch ID & Passcode');
    });

    it('should return Android instructions', () => {
      // Arrange
      Platform.OS = 'android';

      // Act
      const result = biometricService.getSetupInstructions();

      // Assert
      expect(result).toContain('Settings > Security');
      expect(result).toContain('Biometric authentication');
    });
  });
});
