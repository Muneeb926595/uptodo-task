/**
 * Storage Adapter Interface
 * 
 * Abstract interface for storage implementations.
 * Allows swapping MMKV, AsyncStorage, SQLite, etc.
 */

export interface StorageAdapter {
  /**
   * Set a value in storage
   */
  set(key: string, value: string): void;

  /**
   * Get a value from storage
   */
  get(key: string): string | undefined;

  /**
   * Remove a key from storage
   */
  remove(key: string): void;

  /**
   * Clear all storage
   */
  clearAll(): void;

  /**
   * Check if key exists
   */
  contains(key: string): boolean;

  /**
   * Get all keys
   */
  getAllKeys(): string[];
}
