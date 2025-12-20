import { StorageAdapter } from './storage-adapter';

/**
 * Storage Keys Enum
 *
 * Centralized storage keys to prevent typos and enable refactoring.
 */
export enum StorageKeys {
  // Auth
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',

  // User
  USER_PROFILE = 'user_profile',

  // App Settings
  SELECTED_APP_LANGUAGE = 'selected_app_language',
  APP_THEME = 'app_theme',
  SETTINGS = 'app_settings',
  IS_APP_OPEND_FIRSTTIME = 'is_app_opened_firsttime',
  IS_PROFILE_SETUP_COMPLETE = 'is_profile_setup_complete',
  APP_LOCK_ENABLED = 'app_lock_enabled',
  BIOMETRIC_TYPE = 'biometric_type',

  // Todo Module
  TODOS = 'todos',
  CATEGORIES = 'categories',
  ATTACHMENTS = 'attachments',
  NOTIFICATIONS = 'notifications',

  // Focus Module
  FOCUS_SESSIONS = 'focus_sessions',
  ACTIVE_FOCUS_SESSION = 'active_focus_session',

  // Notification Module
  SUPPRESSED_NOTIFICATIONS = 'suppressed_notifications',
}

/**
 * Storage Service
 *
 * Centralized storage operations with type-safe key management.
 * Supports any storage adapter (MMKV, AsyncStorage, SQLite).
 */
export class StorageService {
  constructor(private adapter: StorageAdapter) {}

  /**
   * Set a value in storage
   */
  async setItem<T>(key: StorageKeys, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      this.adapter.set(key, serialized);
    } catch (error) {
      console.error(`[StorageService] Failed to set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a value from storage
   */
  async getItem<T>(key: StorageKeys, defaultValue?: T): Promise<T | null> {
    try {
      const value = this.adapter.get(key);
      if (value === undefined) {
        return defaultValue ?? null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`[StorageService] Failed to get ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove a key from storage
   */
  async removeItem(key: StorageKeys): Promise<void> {
    try {
      this.adapter.remove(key);
    } catch (error) {
      console.error(`[StorageService] Failed to remove ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clearAll(): Promise<void> {
    try {
      this.adapter.clearAll();
    } catch (error) {
      console.error('[StorageService] Failed to clear all:', error);
      throw error;
    }
  }

  /**
   * Check if a key exists
   */
  hasKey(key: StorageKeys): boolean {
    return this.adapter.contains(key);
  }

  /**
   * Get all storage keys
   */
  getAllKeys(): string[] {
    return this.adapter.getAllKeys();
  }
}
