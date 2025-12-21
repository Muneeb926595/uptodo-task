/**
 * MMKV Adapter Test Suite
 *
 * Tests the MMKV adapter implementation
 */

import { createMMKV, MMKV } from 'react-native-mmkv';
import { MMKVAdapter } from '../mmkv-adapter';

// Mock createMMKV
jest.mock('react-native-mmkv');

describe('MMKVAdapter', () => {
  let mmkvAdapter: MMKVAdapter;
  let mockMMKV: jest.Mocked<MMKV>;

  beforeEach(() => {
    // Create mock MMKV instance
    mockMMKV = {
      set: jest.fn(),
      getString: jest.fn(),
      getNumber: jest.fn(),
      getBoolean: jest.fn(),
      contains: jest.fn(),
      remove: jest.fn(),
      clearAll: jest.fn(),
      getAllKeys: jest.fn(() => []),
    } as any;

    // Mock createMMKV to return our mock instance
    (createMMKV as jest.Mock).mockReturnValue(mockMMKV);

    mmkvAdapter = new MMKVAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('should store string value in MMKV', () => {
      // Arrange
      const key = 'test_key';
      const value = 'test_value';

      // Act
      mmkvAdapter.set(key, value);

      // Assert
      expect(mockMMKV.set).toHaveBeenCalledWith(key, value);
    });

    it('should handle empty strings', () => {
      // Arrange
      const key = 'empty_key';
      const value = '';

      // Act
      mmkvAdapter.set(key, value);

      // Assert
      expect(mockMMKV.set).toHaveBeenCalledWith(key, '');
    });
  });

  describe('get', () => {
    it('should retrieve string value from MMKV', () => {
      // Arrange
      const key = 'test_key';
      const value = 'test_value';
      mockMMKV.getString.mockReturnValue(value);

      // Act
      const result = mmkvAdapter.get(key);

      // Assert
      expect(mockMMKV.getString).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });

    it('should return undefined for non-existent keys', () => {
      // Arrange
      const key = 'non_existent';
      mockMMKV.getString.mockReturnValue(undefined);

      // Act
      const result = mmkvAdapter.get(key);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should delete key from MMKV', () => {
      // Arrange
      const key = 'test_key';

      // Act
      mmkvAdapter.remove(key);

      // Assert
      expect(mockMMKV.remove).toHaveBeenCalledWith(key);
    });
  });

  describe('clearAll', () => {
    it('should clear all MMKV storage', () => {
      // Act
      mmkvAdapter.clearAll();

      // Assert
      expect(mockMMKV.clearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('contains', () => {
    it('should return true when key exists', () => {
      // Arrange
      const key = 'existing_key';
      mockMMKV.contains.mockReturnValue(true);

      // Act
      const result = mmkvAdapter.contains(key);

      // Assert
      expect(mockMMKV.contains).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', () => {
      // Arrange
      const key = 'non_existent';
      mockMMKV.contains.mockReturnValue(false);

      // Act
      const result = mmkvAdapter.contains(key);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    it('should return all storage keys', () => {
      // Arrange
      const keys = ['key1', 'key2', 'key3'];
      mockMMKV.getAllKeys.mockReturnValue(keys);

      // Act
      const result = mmkvAdapter.getAllKeys();

      // Assert
      expect(mockMMKV.getAllKeys).toHaveBeenCalledTimes(1);
      expect(result).toEqual(keys);
    });

    it('should return empty array when no keys exist', () => {
      // Arrange
      mockMMKV.getAllKeys.mockReturnValue([]);

      // Act
      const result = mmkvAdapter.getAllKeys();

      // Assert
      expect(result).toEqual([]);
    });
  });
});
