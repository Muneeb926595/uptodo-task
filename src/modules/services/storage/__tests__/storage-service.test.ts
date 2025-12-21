/**
 * Storage Service Test Suite
 *
 * Tests the StorageService class with a mock adapter.
 * Follows AAA pattern (Arrange, Act, Assert).
 */

import { StorageService, StorageKeys } from '../storage-service';
import { StorageAdapter } from '../storage-adapter';

describe('StorageService', () => {
  let storageService: StorageService;
  let mockAdapter: jest.Mocked<StorageAdapter>;

  // Setup: runs before each test
  beforeEach(() => {
    // Create mock adapter with all required methods
    mockAdapter = {
      set: jest.fn(),
      get: jest.fn(),
      remove: jest.fn(),
      clearAll: jest.fn(),
      contains: jest.fn(),
      getAllKeys: jest.fn(),
    };

    // Initialize service with mock adapter
    storageService = new StorageService(mockAdapter);
  });

  // Cleanup: runs after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should serialize and store a string value', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const value = 'John Doe';

      // Act
      await storageService.setItem(key, value);

      // Assert
      expect(mockAdapter.set).toHaveBeenCalledWith(key, JSON.stringify(value));
      expect(mockAdapter.set).toHaveBeenCalledTimes(1);
    });

    it('should serialize and store an object value', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const value = { name: 'John Doe', email: 'john@example.com' };

      // Act
      await storageService.setItem(key, value);

      // Assert
      expect(mockAdapter.set).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should serialize and store an array value', async () => {
      // Arrange
      const key = StorageKeys.TODOS;
      const value = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];

      // Act
      await storageService.setItem(key, value);

      // Assert
      expect(mockAdapter.set).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should handle boolean values correctly', async () => {
      // Arrange
      const key = StorageKeys.APP_LOCK_ENABLED;
      const value = true;

      // Act
      await storageService.setItem(key, value);

      // Assert
      expect(mockAdapter.set).toHaveBeenCalledWith(key, 'true');
    });

    it('should handle null values', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const value = null;

      // Act
      await storageService.setItem(key, value);

      // Assert
      expect(mockAdapter.set).toHaveBeenCalledWith(key, 'null');
    });

    it('should throw error when serialization fails', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const circularReference: any = {};
      circularReference.self = circularReference; // Creates circular structure

      // Act & Assert
      await expect(
        storageService.setItem(key, circularReference),
      ).rejects.toThrow();
    });

    it('should propagate adapter errors', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const value = 'test';
      const error = new Error('Storage full');
      mockAdapter.set.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(storageService.setItem(key, value)).rejects.toThrow(
        'Storage full',
      );
    });
  });

  describe('getItem', () => {
    it('should retrieve and deserialize a string value', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const value = 'John Doe';
      mockAdapter.get.mockReturnValue(JSON.stringify(value));

      // Act
      const result = await storageService.getItem<string>(key);

      // Assert
      expect(mockAdapter.get).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });

    it('should retrieve and deserialize an object value', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const value = { name: 'John Doe', email: 'john@example.com' };
      mockAdapter.get.mockReturnValue(JSON.stringify(value));

      // Act
      const result = await storageService.getItem<typeof value>(key);

      // Assert
      expect(result).toEqual(value);
    });

    it('should retrieve and deserialize an array value', async () => {
      // Arrange
      const key = StorageKeys.TODOS;
      const value = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];
      mockAdapter.get.mockReturnValue(JSON.stringify(value));

      // Act
      const result = await storageService.getItem<typeof value>(key);

      // Assert
      expect(result).toEqual(value);
    });

    it('should return null when key does not exist', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      mockAdapter.get.mockReturnValue(undefined);

      // Act
      const result = await storageService.getItem(key);

      // Assert
      expect(result).toBeNull();
    });

    it('should return default value when key does not exist', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const defaultValue = { name: 'Guest' };
      mockAdapter.get.mockReturnValue(undefined);

      // Act
      const result = await storageService.getItem(key, defaultValue);

      // Assert
      expect(result).toEqual(defaultValue);
    });

    it('should return default value when deserialization fails', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const defaultValue = { name: 'Guest' };
      mockAdapter.get.mockReturnValue('invalid-json{');

      // Act
      const result = await storageService.getItem(key, defaultValue);

      // Assert
      expect(result).toEqual(defaultValue);
    });

    it('should handle boolean values correctly', async () => {
      // Arrange
      const key = StorageKeys.APP_LOCK_ENABLED;
      mockAdapter.get.mockReturnValue('true');

      // Act
      const result = await storageService.getItem<boolean>(key);

      // Assert
      expect(result).toBe(true);
    });

    it('should handle null stored values', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      mockAdapter.get.mockReturnValue('null');

      // Act
      const result = await storageService.getItem(key);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should call adapter remove method', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;

      // Act
      await storageService.removeItem(key);

      // Assert
      expect(mockAdapter.remove).toHaveBeenCalledWith(key);
      expect(mockAdapter.remove).toHaveBeenCalledTimes(1);
    });

    it('should propagate adapter errors', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const error = new Error('Remove failed');
      mockAdapter.remove.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(storageService.removeItem(key)).rejects.toThrow(
        'Remove failed',
      );
    });
  });

  describe('clearAll', () => {
    it('should call adapter clearAll method', async () => {
      // Act
      await storageService.clearAll();

      // Assert
      expect(mockAdapter.clearAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate adapter errors', async () => {
      // Arrange
      const error = new Error('Clear failed');
      mockAdapter.clearAll.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(storageService.clearAll()).rejects.toThrow('Clear failed');
    });
  });

  describe('hasKey', () => {
    it('should return true when key exists', () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      mockAdapter.contains.mockReturnValue(true);

      // Act
      const result = storageService.hasKey(key);

      // Assert
      expect(mockAdapter.contains).toHaveBeenCalledWith(key);
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      mockAdapter.contains.mockReturnValue(false);

      // Act
      const result = storageService.hasKey(key);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    it('should return all storage keys', () => {
      // Arrange
      const keys = ['user_profile', 'access_token', 'app_theme'];
      mockAdapter.getAllKeys.mockReturnValue(keys);

      // Act
      const result = storageService.getAllKeys();

      // Assert
      expect(mockAdapter.getAllKeys).toHaveBeenCalledTimes(1);
      expect(result).toEqual(keys);
    });

    it('should return empty array when no keys exist', () => {
      // Arrange
      mockAdapter.getAllKeys.mockReturnValue([]);

      // Act
      const result = storageService.getAllKeys();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete set-get-remove flow', async () => {
      // Arrange
      const key = StorageKeys.USER_PROFILE;
      const value = { name: 'John Doe' };
      mockAdapter.get.mockReturnValue(JSON.stringify(value));

      // Act - Set
      await storageService.setItem(key, value);
      expect(mockAdapter.set).toHaveBeenCalledWith(key, JSON.stringify(value));

      // Act - Get
      const retrieved = await storageService.getItem(key);
      expect(retrieved).toEqual(value);

      // Act - Remove
      await storageService.removeItem(key);
      expect(mockAdapter.remove).toHaveBeenCalledWith(key);
    });

    it('should handle multiple items independently', async () => {
      // Arrange
      const userProfile = { name: 'John' };
      const settings = { theme: 'dark' };

      mockAdapter.get.mockImplementation((key: string) => {
        if (key === StorageKeys.USER_PROFILE) {
          return JSON.stringify(userProfile);
        }
        if (key === StorageKeys.SETTINGS) {
          return JSON.stringify(settings);
        }
        return undefined;
      });

      // Act
      await storageService.setItem(StorageKeys.USER_PROFILE, userProfile);
      await storageService.setItem(StorageKeys.SETTINGS, settings);

      const retrievedUser = await storageService.getItem(
        StorageKeys.USER_PROFILE,
      );
      const retrievedSettings = await storageService.getItem(
        StorageKeys.SETTINGS,
      );

      // Assert
      expect(retrievedUser).toEqual(userProfile);
      expect(retrievedSettings).toEqual(settings);
    });
  });
});
