/**
 * Profile Repository Test Suite
 *
 * Tests profile repository functionality including CRUD and app lock settings
 */

// Mock dependencies BEFORE imports
jest.mock('../../../services/storage');
jest.mock('../../../../app/utils/id');

import { profileRepository } from '../profile-repository';
import { storageService, StorageKeys } from '../../../services/storage';
import { generateId } from '../../../../app/utils/id';
import { UserProfile } from '../../types/profile.types';

describe('ProfileRepository', () => {
  const mockProfile: UserProfile = {
    id: 'profile-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: 1234567890,
    updatedAt: 1234567890,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (generateId as jest.Mock).mockReturnValue('generated-id');
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(mockProfile);

      // Act
      const result = await profileRepository.getProfile();

      // Assert
      expect(result).toEqual(mockProfile);
      expect(storageService.getItem).toHaveBeenCalledWith(
        StorageKeys.USER_PROFILE,
      );
    });

    it('should return null if profile does not exist', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await profileRepository.getProfile();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileRepository.getProfile();

      // Assert
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('createProfile', () => {
    it('should create a new profile', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      const payload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatar: 'https://example.com/jane.jpg',
      };

      // Act
      const result = await profileRepository.createProfile(payload);

      // Assert
      expect(result).toMatchObject({
        id: 'generated-id',
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatar: 'https://example.com/jane.jpg',
        createdAt: now,
        updatedAt: now,
      });
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.USER_PROFILE,
        expect.any(Object),
      );
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.IS_PROFILE_SETUP_COMPLETE,
        'true',
      );
    });

    it('should mark profile setup as complete', async () => {
      // Arrange
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await profileRepository.createProfile({
        name: 'Test User',
        email: 'test@example.com',
      });

      // Assert
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.IS_PROFILE_SETUP_COMPLETE,
        'true',
      );
    });
  });

  describe('updateProfile', () => {
    it('should update existing profile', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      (storageService.getItem as jest.Mock).mockResolvedValue(mockProfile);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      const patch = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      // Act
      const result = await profileRepository.updateProfile(patch);

      // Assert
      expect(result).toMatchObject({
        ...mockProfile,
        name: 'Updated Name',
        email: 'updated@example.com',
        updatedAt: now,
      });
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.USER_PROFILE,
        expect.any(Object),
      );
    });

    it('should return null if profile does not exist', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileRepository.updateProfile({
        name: 'New Name',
      });

      // Assert
      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should preserve fields not in patch', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(mockProfile);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await profileRepository.updateProfile({
        name: 'New Name',
      });

      // Assert
      expect(result?.email).toBe(mockProfile.email);
      expect(result?.avatar).toBe(mockProfile.avatar);
    });
  });

  describe('deleteProfile', () => {
    it('should delete the profile and setup flag', async () => {
      // Arrange
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await profileRepository.deleteProfile();

      // Assert
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.USER_PROFILE,
      );
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.IS_PROFILE_SETUP_COMPLETE,
      );
    });
  });

  describe('isProfileSetupComplete', () => {
    it('should return true if setup is complete', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue('true');

      // Act
      const result = await profileRepository.isProfileSetupComplete();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if setup is not complete', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await profileRepository.isProfileSetupComplete();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockRejectedValue(
        new Error('Error'),
      );

      // Act
      const result = await profileRepository.isProfileSetupComplete();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isAppLockEnabled', () => {
    it('should return true if app lock is enabled', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue('true');

      // Act
      const result = await profileRepository.isAppLockEnabled();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if app lock is disabled', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue('false');

      // Act
      const result = await profileRepository.isAppLockEnabled();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockRejectedValue(
        new Error('Error'),
      );

      // Act
      const result = await profileRepository.isAppLockEnabled();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('enableAppLock', () => {
    it('should enable app lock with biometric type', async () => {
      // Arrange
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await profileRepository.enableAppLock('FaceID');

      // Assert
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.APP_LOCK_ENABLED,
        'true',
      );
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.BIOMETRIC_TYPE,
        'FaceID',
      );
    });
  });

  describe('disableAppLock', () => {
    it('should disable app lock and remove biometric type', async () => {
      // Arrange
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await profileRepository.disableAppLock();

      // Assert
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.APP_LOCK_ENABLED,
        'false',
      );
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.BIOMETRIC_TYPE,
      );
    });
  });

  describe('getBiometricType', () => {
    it('should return stored biometric type', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue('TouchID');

      // Act
      const result = await profileRepository.getBiometricType();

      // Assert
      expect(result).toBe('TouchID');
    });

    it('should return null if no biometric type stored', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await profileRepository.getBiometricType();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockRejectedValue(
        new Error('Error'),
      );

      // Act
      const result = await profileRepository.getBiometricType();

      // Assert
      expect(result).toBeNull();
    });
  });
});
