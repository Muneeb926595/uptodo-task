// src/utils/StorageHelper.ts
import { createMMKV, MMKV } from 'react-native-mmkv';

// -----------------------------
// Define storage keys centrally
// -----------------------------
export enum StorageKeys {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  SELECTED_APP_LANGUAGE = 'selected_app_language',
  USER_PROFILE = 'user_profile',
  APP_THEME = 'app_theme',
  TODOS = 'todos', // Record<string, Todo>
  CATEGORIES = 'categories', // Record<string, Category>
  ATTACHMENTS = 'attachments', // Record<string, TodoAttachment>
  NOTIFICATIONS = 'notifications', // Record<string, TodoNotification>
  SETTINGS = 'app_settings',
  OFFLINE_QUEUE = 'offline_queue', // for queued operations when offline
  // Add more keys here
}

// -----------------------------
// MMKV instance configuration
// -----------------------------
const defaultMMKV = createMMKV({
  id: 'app_storage',
  encryptionKey: 'super-secret-key-32-char', // use env variable in production
  //   accessible: 'accessibleAfterFirstUnlock', // iOS only
});

// -----------------------------
// Helper functions
// -----------------------------
class StorageHelperClass {
  private storage: MMKV;

  constructor(storageInstance: MMKV = defaultMMKV) {
    this.storage = storageInstance;
  }

  // -----------------------------
  // Set a value
  // -----------------------------
  setItem = async <T = string>(key: StorageKeys, value: T) => {
    try {
      if (typeof value === 'object') {
        this.storage.set(key, JSON.stringify(value));
      } else {
        this.storage.set(key, value as any);
      }
    } catch (error) {
      console.error(`[StorageHelper] setItem error for key: ${key}`, error);
      throw error;
    }
  };

  // -----------------------------
  // Get a value
  // -----------------------------
  getItem = async <T = string>(
    key: StorageKeys,
    defaultValue?: T,
  ): Promise<T | null> => {
    try {
      const value = this.storage.getString(key);
      if (value == null) return defaultValue ?? null;

      // Try to parse JSON safely
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`[StorageHelper] getItem error for key: ${key}`, error);
      return defaultValue ?? null;
    }
  };

  // -----------------------------
  // Remove a key
  // -----------------------------
  removeItem = async (key: StorageKeys) => {
    try {
      this.storage.remove(key);
    } catch (error) {
      console.error(`[StorageHelper] removeItem error for key: ${key}`, error);
      throw error;
    }
  };

  // -----------------------------
  // Clear all storage
  // -----------------------------
  clearAll = async () => {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error('[StorageHelper] clearAll error', error);
      throw error;
    }
  };

  // -----------------------------
  // Check if a key exists
  // -----------------------------
  hasKey = (key: StorageKeys): boolean => {
    return this.storage.contains(key);
  };

  // -----------------------------
  // Get all keys (for debugging)
  // -----------------------------
  getAllKeys = (): string[] => {
    return this.storage.getAllKeys();
  };
}

// -----------------------------
// Export singleton instance
// -----------------------------
const StorageHelper = new StorageHelperClass();
export default StorageHelper;
