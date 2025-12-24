/**
 * Profile Repository
 * Handles user profile data persistence
 */

import { storageService, StorageKeys } from '../../services/storage';
import { generateId } from '../../utils/id';
import {
  UserProfile,
  CreateProfilePayload,
  UpdateProfilePayload,
} from '../../types/profile.types';

class ProfileRepository {
  /**
   * Get the current user profile
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const profile = await storageService.getItem<UserProfile>(
        StorageKeys.USER_PROFILE,
      );
      return profile;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  /**
   * Create a new user profile
   */
  async createProfile(payload: CreateProfilePayload): Promise<UserProfile> {
    const now = Date.now();
    const profile: UserProfile = {
      id: generateId(),
      name: payload.name,
      email: payload.email,
      avatar: payload.avatar,
      createdAt: now,
      updatedAt: now,
    };

    await storageService.setItem(StorageKeys.USER_PROFILE, profile);
    await storageService.setItem(StorageKeys.IS_PROFILE_SETUP_COMPLETE, 'true');

    return profile;
  }

  /**
   * Update existing user profile
   */
  async updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<UserProfile | null> {
    try {
      const existing = await this.getProfile();
      if (!existing) {
        throw new Error('Profile not found');
      }

      const updated: UserProfile = {
        ...existing,
        ...payload,
        updatedAt: Date.now(),
      };

      await storageService.setItem(StorageKeys.USER_PROFILE, updated);
      return updated;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  /**
   * Delete user profile
   */
  async deleteProfile(): Promise<void> {
    await storageService.removeItem(StorageKeys.USER_PROFILE);
    await storageService.removeItem(StorageKeys.IS_PROFILE_SETUP_COMPLETE);
  }

  /**
   * Check if profile setup is complete
   */
  async isProfileSetupComplete(): Promise<boolean> {
    try {
      const isComplete = await storageService.getItem(
        StorageKeys.IS_PROFILE_SETUP_COMPLETE,
      );
      return isComplete === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if app lock is enabled
   */
  async isAppLockEnabled(): Promise<boolean> {
    try {
      const isEnabled = await storageService.getItem(
        StorageKeys.APP_LOCK_ENABLED,
      );
      return isEnabled === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Enable app lock
   */
  async enableAppLock(biometricType: string): Promise<void> {
    await storageService.setItem(StorageKeys.APP_LOCK_ENABLED, 'true');
    await storageService.setItem(StorageKeys.BIOMETRIC_TYPE, biometricType);
  }

  /**
   * Disable app lock
   */
  async disableAppLock(): Promise<void> {
    await storageService.setItem(StorageKeys.APP_LOCK_ENABLED, 'false');
    await storageService.removeItem(StorageKeys.BIOMETRIC_TYPE);
  }

  /**
   * Get stored biometric type
   */
  async getBiometricType(): Promise<string | null> {
    try {
      const type = await storageService.getItem<string>(
        StorageKeys.BIOMETRIC_TYPE,
      );
      return type || null;
    } catch (error) {
      return null;
    }
  }
}

export const profileRepository = new ProfileRepository();
