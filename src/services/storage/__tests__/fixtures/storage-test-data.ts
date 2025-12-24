/**
 * Test Fixtures for Storage Service
 *
 * Reusable test data for storage-related tests
 */

import { StorageKeys } from '../../storage-service';

/**
 * Sample user profile data
 */
export const mockUserProfile = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

/**
 * Sample todos data
 */
export const mockTodos = [
  {
    id: 'todo-1',
    title: 'Complete project documentation',
    description: 'Write comprehensive docs',
    completed: false,
    priority: 'high',
    categoryId: 'cat-1',
  },
  {
    id: 'todo-2',
    title: 'Review pull requests',
    description: 'Check team PRs',
    completed: true,
    priority: 'medium',
    categoryId: 'cat-2',
  },
];

/**
 * Sample categories data
 */
export const mockCategories = [
  {
    id: 'cat-1',
    name: 'Work',
    icon: 'briefcase',
    color: '#FF6B6B',
  },
  {
    id: 'cat-2',
    name: 'Personal',
    icon: 'user',
    color: '#4ECDC4',
  },
];

/**
 * Sample app settings
 */
export const mockSettings = {
  theme: 'dark',
  language: 'en-US',
  notifications: true,
  biometricEnabled: false,
};

/**
 * Sample tokens
 */
export const mockAuthTokens = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  refreshToken: 'refresh_token_value',
};

/**
 * Helper to create mock storage adapter
 */
export const createMockStorageAdapter = () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn(),
  contains: jest.fn(),
  getAllKeys: jest.fn(() => []),
});

/**
 * Helper to create populated mock adapter
 */
export const createPopulatedMockAdapter = () => {
  const adapter = createMockStorageAdapter();

  // Setup default responses
  adapter.get.mockImplementation((key: string) => {
    switch (key) {
      case StorageKeys.USER_PROFILE:
        return JSON.stringify(mockUserProfile);
      case StorageKeys.TODOS:
        return JSON.stringify(mockTodos);
      case StorageKeys.CATEGORIES:
        return JSON.stringify(mockCategories);
      case StorageKeys.SETTINGS:
        return JSON.stringify(mockSettings);
      case StorageKeys.ACCESS_TOKEN:
        return JSON.stringify(mockAuthTokens.accessToken);
      default:
        return undefined;
    }
  });

  adapter.contains.mockImplementation((key: string) => {
    return [
      StorageKeys.USER_PROFILE,
      StorageKeys.TODOS,
      StorageKeys.CATEGORIES,
      StorageKeys.SETTINGS,
    ].includes(key as StorageKeys);
  });

  adapter.getAllKeys.mockReturnValue([
    StorageKeys.USER_PROFILE,
    StorageKeys.TODOS,
    StorageKeys.CATEGORIES,
    StorageKeys.SETTINGS,
  ] as never);

  return adapter;
};
