/**
 * Auth Repository Test Suite
 *
 * Tests authentication repository functionality
 */

// Mock dependencies BEFORE imports
jest.mock('../../../services/storage');
jest.mock('../../../api/axios/axios-client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}));

import { authRepository } from '../auth-repository';
import { storageService, StorageKeys } from '../../../services/storage';
import { authApi } from '../../../api/endpoints/auth.api';

describe('AuthRepository', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockAccessToken = 'access-token-xyz';
  const mockRefreshToken = 'refresh-token-abc';

  let loginSpy: jest.SpyInstance;
  let refreshTokenSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    loginSpy = jest.spyOn(authApi, 'login');
    refreshTokenSpy = jest.spyOn(authApi, 'refreshToken');
  });

  afterEach(() => {
    loginSpy.mockRestore();
    refreshTokenSpy.mockRestore();
  });

  describe('login', () => {
    it('should login user and store tokens', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse = {
        data: {
          user: mockUser,
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        },
      };
      loginSpy.mockResolvedValue(mockResponse);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await authRepository.login(email, password);

      // Assert
      expect(authApi.login).toHaveBeenCalledWith(email, password);
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.ACCESS_TOKEN,
        mockAccessToken,
      );
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.REFRESH_TOKEN,
        mockRefreshToken,
      );
      expect(result).toEqual(mockUser);
    });

    it('should store tokens in correct order', async () => {
      // Arrange
      const mockResponse = {
        data: {
          user: mockUser,
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        },
      };
      loginSpy.mockResolvedValue(mockResponse);

      const setItemCalls: any[] = [];
      (storageService.setItem as jest.Mock).mockImplementation((key, value) => {
        setItemCalls.push({ key, value });
        return Promise.resolve();
      });

      // Act
      await authRepository.login('test@example.com', 'password');

      // Assert
      expect(setItemCalls).toHaveLength(2);
      expect(setItemCalls[0].key).toBe(StorageKeys.ACCESS_TOKEN);
      expect(setItemCalls[1].key).toBe(StorageKeys.REFRESH_TOKEN);
    });

    it('should propagate API errors', async () => {
      // Arrange
      const error = new Error('Invalid credentials');
      loginSpy.mockRejectedValue(error);

      // Act & Assert
      await expect(
        authRepository.login('test@example.com', 'wrong-password'),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      // Arrange
      const storedRefreshToken = 'stored-refresh-token';
      const newAccessToken = 'new-access-token';
      (storageService.getItem as jest.Mock).mockResolvedValue(
        storedRefreshToken,
      );
      refreshTokenSpy.mockResolvedValue({
        data: { accessToken: newAccessToken },
      });
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await authRepository.refreshToken();

      // Assert
      expect(storageService.getItem).toHaveBeenCalledWith(
        StorageKeys.REFRESH_TOKEN,
      );
      expect(authApi.refreshToken).toHaveBeenCalledWith(storedRefreshToken);
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.ACCESS_TOKEN,
        newAccessToken,
      );
      expect(result).toBe(newAccessToken);
    });

    it('should handle missing refresh token', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);
      refreshTokenSpy.mockResolvedValue({
        data: { accessToken: 'new-token' },
      });

      // Act
      await authRepository.refreshToken();

      // Assert
      expect(authApi.refreshToken).toHaveBeenCalledWith(null);
    });

    it('should propagate refresh errors', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue('refresh-token');
      const error = new Error('Token expired');
      refreshTokenSpy.mockRejectedValue(error);

      // Act & Assert
      await expect(authRepository.refreshToken()).rejects.toThrow(
        'Token expired',
      );
    });
  });

  describe('logout', () => {
    it('should remove both tokens from storage', async () => {
      // Arrange
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await authRepository.logout();

      // Assert
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.ACCESS_TOKEN,
      );
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.REFRESH_TOKEN,
      );
      expect(storageService.removeItem).toHaveBeenCalledTimes(2);
    });

    it('should complete successfully even if tokens do not exist', async () => {
      // Arrange
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await authRepository.logout();

      // Assert
      expect(storageService.removeItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete login-logout flow', async () => {
      // Arrange - Login
      const mockResponse = {
        data: {
          user: mockUser,
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        },
      };
      loginSpy.mockResolvedValue(mockResponse);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act - Login
      const user = await authRepository.login('test@example.com', 'password');
      expect(user).toEqual(mockUser);

      // Arrange - Logout
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act - Logout
      await authRepository.logout();

      // Assert
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.ACCESS_TOKEN,
      );
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.REFRESH_TOKEN,
      );
    });

    it('should handle login-refresh-logout flow', async () => {
      // Login
      loginSpy.mockResolvedValue({
        data: {
          user: mockUser,
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        },
      });
      await authRepository.login('test@example.com', 'password');

      // Refresh
      (storageService.getItem as jest.Mock).mockResolvedValue(mockRefreshToken);
      refreshTokenSpy.mockResolvedValue({
        data: { accessToken: 'new-access-token' },
      });
      const newToken = await authRepository.refreshToken();
      expect(newToken).toBe('new-access-token');

      // Logout
      await authRepository.logout();
      expect(storageService.removeItem).toHaveBeenCalledTimes(2);
    });
  });
});
