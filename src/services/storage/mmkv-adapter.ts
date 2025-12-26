import { createMMKV, MMKV } from 'react-native-mmkv';
import { StorageAdapter } from './storage-adapter';

// Export MMKV instance for Rozenite DevTools
export const mmkvInstance = createMMKV({
  id: 'default-mmkv-storage',
  encryptionKey: 'uptodo-secure-key-2024',
});

/**
 * MMKV Adapter Implementation
 *
 * High-performance, encrypted local storage using MMKV.
 */
export class MMKVAdapter implements StorageAdapter {
  private storage: MMKV;

  constructor() {
    this.storage = mmkvInstance;
  }

  set(key: string, value: string): void {
    this.storage.set(key, value);
  }

  get(key: string): string | undefined {
    return this.storage.getString(key);
  }

  remove(key: string): void {
    this.storage.remove(key);
  }

  clearAll(): void {
    this.storage.clearAll();
  }

  contains(key: string): boolean {
    return this.storage.contains(key);
  }

  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }
}
