/**
 * Error Handler Service Test Suite
 *
 * Tests the error parsing and alert functionality
 */

import { Alert } from 'react-native';
import { parseApiError, showApiErrorAlert } from '../index';
import { storageService, StorageKeys } from '../../storage';
import { store } from '../../../../app/stores';
import { clearUser } from '../../../auth/store/authSlice';

// Mock dependencies
jest.mock('../../storage');
jest.mock('../../../../app/stores', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));
jest.mock('../../../auth/store/authSlice', () => ({
  clearUser: jest.fn(),
}));

const mockAlert = jest.fn();
(Alert as any).alert = mockAlert;

describe('Error Handler Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockClear();
  });

  describe('parseApiError', () => {
    it('should parse error with response data', () => {
      // Arrange
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Bad request',
            code: 'INVALID_INPUT',
          },
        },
      };

      // Act
      const result = parseApiError(error);

      // Assert
      expect(result).toEqual({
        status: 400,
        message: 'Bad request',
        code: 'INVALID_INPUT',
        original: error,
      });
    });

    it('should parse error with nested error field', () => {
      // Arrange
      const error = {
        response: {
          status: 500,
          data: {
            error: 'Internal server error',
          },
        },
      };

      // Act
      const result = parseApiError(error);

      // Assert
      expect(result).toEqual({
        status: 500,
        message: 'Internal server error',
        code: undefined,
        original: error,
      });
    });

    it('should parse error with detail field', () => {
      // Arrange
      const error = {
        response: {
          status: 404,
          data: {
            detail: 'Resource not found',
          },
        },
      };

      // Act
      const result = parseApiError(error);

      // Assert
      expect(result).toEqual({
        status: 404,
        message: 'Resource not found',
        code: undefined,
        original: error,
      });
    });

    it('should fallback to error.message when data is empty', () => {
      // Arrange
      const error = {
        response: {
          status: 500,
          data: {},
        },
        message: 'Request failed',
      };

      // Act
      const result = parseApiError(error);

      // Assert
      expect(result.message).toBe('Request failed');
      expect(result.status).toBe(500);
    });

    it('should handle network errors (request without response)', () => {
      // Arrange
      const error = {
        request: {},
        message: 'Network Error',
      };

      // Act
      const result = parseApiError(error);

      // Assert
      expect(result).toEqual({
        message: 'Network error. Please check your connection.',
        original: error,
      });
    });

    it('should handle generic errors', () => {
      // Arrange
      const error = {
        message: 'Something went wrong',
      };

      // Act
      const result = parseApiError(error);

      // Assert
      expect(result).toEqual({
        message: 'Something went wrong',
        original: error,
      });
    });

    it('should handle null/undefined errors', () => {
      // Act
      const result = parseApiError(null);

      // Assert
      expect(result.message).toBe('Unknown error');
      expect(result.original).toBeNull();
    });

    it('should handle error with only status code', () => {
      // Arrange
      const error = {
        response: {
          status: 503,
          data: null,
        },
      };

      // Act
      const result = parseApiError(error);

      // Assert
      expect(result.status).toBe(503);
      expect(result.message).toBe('An error occurred');
    });
  });

  describe('showApiErrorAlert', () => {
    it('should show alert for regular errors', async () => {
      // Arrange
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid data' },
        },
      };
      mockAlert.mockImplementation((title, message, buttons) => {
        buttons[0].onPress(); // Click OK
      });

      // Act
      await showApiErrorAlert(error);

      // Assert
      expect(mockAlert).toHaveBeenCalledWith(
        'Error',
        'Invalid data',
        [{ text: 'OK', onPress: expect.any(Function) }],
        { cancelable: true },
      );
    });

    it('should show alert with custom title', async () => {
      // Arrange
      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };
      mockAlert.mockImplementation((title, message, buttons) => {
        buttons[0].onPress();
      });

      // Act
      await showApiErrorAlert(error, { title: 'Custom Title' });

      // Assert
      expect(mockAlert).toHaveBeenCalledWith(
        'Custom Title',
        'Server error',
        expect.any(Array),
        expect.any(Object),
      );
    });

    it('should show retry button when onRetry is provided', async () => {
      // Arrange
      const error = {
        response: {
          status: 503,
          data: { message: 'Service unavailable' },
        },
      };
      const onRetry = jest.fn();
      mockAlert.mockImplementation((title, message, buttons) => {
        buttons[1].onPress(); // Click OK (Retry is first, OK is second)
      });

      // Act
      await showApiErrorAlert(error, { onRetry });

      // Assert
      expect(mockAlert).toHaveBeenCalled();
      const buttons = mockAlert.mock.calls[0][2];
      expect(buttons).toHaveLength(2);
      expect(buttons[0].text).toBe('Retry');
      expect(buttons[1].text).toBe('OK');
    });

    it('should handle 401 error and clear session', async () => {
      // Arrange
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);
      mockAlert.mockImplementation((title, message, buttons) => {
        buttons[0].onPress();
      });

      // Act
      await showApiErrorAlert(error);

      // Assert
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.ACCESS_TOKEN,
      );
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.REFRESH_TOKEN,
      );
      expect(store.dispatch).toHaveBeenCalledWith(clearUser());
      expect(mockAlert).toHaveBeenCalledWith(
        'Session expired',
        'Unauthorized',
        [{ text: 'OK', onPress: expect.any(Function) }],
      );
    });

    it('should handle 401 with fallback message when data is empty', async () => {
      // Arrange
      const error = {
        response: {
          status: 401,
          data: {},
        },
        message: 'Request failed',
      };
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);
      mockAlert.mockImplementation((title, message, buttons) => {
        buttons[0].onPress();
      });

      // Act
      await showApiErrorAlert(error);

      // Assert
      // When data is empty, it falls back to error.message, then to default
      expect(mockAlert).toHaveBeenCalledWith(
        'Session expired',
        expect.stringContaining('Request failed'),
        [{ text: 'OK', onPress: expect.any(Function) }],
      );
    });

    it('should handle store dispatch errors gracefully', async () => {
      // Arrange
      const error = {
        response: {
          status: 401,
          data: { message: 'Token expired' },
        },
      };
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);
      (store.dispatch as jest.Mock).mockImplementation(() => {
        throw new Error('Redux error');
      });
      mockAlert.mockImplementation((title, message, buttons) => {
        buttons[0].onPress();
      });

      // Act & Assert - Should not throw
      await expect(showApiErrorAlert(error)).resolves.not.toThrow();
      expect(mockAlert).toHaveBeenCalled();
    });

    it('should call onRetry when retry button is pressed', async () => {
      // Arrange
      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };
      const onRetry = jest.fn();
      mockAlert.mockImplementation((title, message, buttons) => {
        buttons[0].onPress(); // Click Retry button
      });

      // Act
      await showApiErrorAlert(error, { onRetry });

      // Assert
      expect(onRetry).toHaveBeenCalled();
    });
  });
});
