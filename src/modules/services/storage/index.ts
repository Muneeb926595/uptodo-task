import { MMKVAdapter } from './mmkv-adapter';
import { StorageService } from './storage-service';

/**
 * Storage Service Singleton
 * 
 * Centralized storage instance using MMKV adapter.
 * Import this throughout the app for all storage operations.
 */
export const storageService = new StorageService(new MMKVAdapter());

// Re-export types
export { StorageKeys } from './storage-service';
export type { StorageAdapter } from './storage-adapter';
