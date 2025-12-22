/**
 * Focus Repository Test Suite
 *
 * Tests focus repository session management and statistics
 */

// Mock dependencies BEFORE imports
jest.mock('../../../services/storage');
jest.mock('../../../services/notifications');
jest.mock('../../../todo/repository/todo-repository');

import { focusRepository, FocusSession } from '../focus-repository';
import { storageService, StorageKeys } from '../../../services/storage';
import { notificationService } from '../../../services/notifications';
import { todoRepository } from '../../../todo/repository/todo-repository';

describe('FocusRepository', () => {
  const mockSession: FocusSession = {
    id: 'focus_1234567890',
    startTime: 1234567890,
    endTime: 1234571490, // 1 hour later
    duration: 3600, // 1 hour in seconds
    completed: false,
    createdAt: 1234567890,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (todoRepository.getAll as jest.Mock).mockResolvedValue([]);
    (notificationService.suppressNotifications as jest.Mock).mockResolvedValue(
      undefined,
    );
    (notificationService.restoreNotifications as jest.Mock).mockResolvedValue(
      undefined,
    );
  });

  describe('createSession', () => {
    it('should create a new focus session', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const duration = 1800; // 30 minutes
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await focusRepository.createSession(duration);

      // Assert
      expect(result).toMatchObject({
        id: `focus_${now}`,
        startTime: now,
        endTime: now + duration * 1000,
        duration,
        completed: false,
        createdAt: now,
      });
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.FOCUS_SESSIONS,
        expect.any(Object),
      );
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.ACTIVE_FOCUS_SESSION,
        expect.any(Object),
      );
    });

    it('should suppress notifications during focus session', async () => {
      // Arrange
      const duration = 1800;
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const mockTodos = [{ id: 'todo-1', title: 'Test' }];
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (todoRepository.getAll as jest.Mock).mockResolvedValue(mockTodos);

      // Act
      await focusRepository.createSession(duration);

      // Assert
      expect(notificationService.suppressNotifications).toHaveBeenCalledWith(
        mockTodos,
        now + duration * 1000,
      );
    });
  });

  describe('getActiveSession', () => {
    it('should return active session if not expired', async () => {
      // Arrange
      const futureSession = { ...mockSession, endTime: Date.now() + 10000 };
      (storageService.getItem as jest.Mock).mockResolvedValue(futureSession);

      // Act
      const result = await focusRepository.getActiveSession();

      // Assert
      expect(result).toEqual(futureSession);
    });

    it('should return null if no active session', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await focusRepository.getActiveSession();

      // Assert
      expect(result).toBeNull();
    });

    it('should clean up expired session', async () => {
      // Arrange
      const expiredSession = { ...mockSession, endTime: Date.now() - 1000 };
      (storageService.getItem as jest.Mock)
        .mockResolvedValueOnce(expiredSession) // First call for getActiveSession
        .mockResolvedValueOnce({ [expiredSession.id]: expiredSession }); // Second call for loadSessions in completeSession
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await focusRepository.getActiveSession();

      // Assert
      expect(result).toBeNull();
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.ACTIVE_FOCUS_SESSION,
      );
    });
  });

  describe('completeSession', () => {
    it('should mark session as completed', async () => {
      // Arrange
      const sessionMap = { [mockSession.id]: mockSession };
      (storageService.getItem as jest.Mock).mockResolvedValue(sessionMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await focusRepository.completeSession(mockSession.id, true);

      // Assert
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap[mockSession.id].completed).toBe(true);
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.ACTIVE_FOCUS_SESSION,
      );
    });

    it('should restore notifications after completion', async () => {
      // Arrange
      const sessionMap = { [mockSession.id]: mockSession };
      (storageService.getItem as jest.Mock).mockResolvedValue(sessionMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await focusRepository.completeSession(mockSession.id, true);

      // Assert
      expect(notificationService.restoreNotifications).toHaveBeenCalled();
    });

    it('should handle non-existent session gracefully', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (storageService.removeItem as jest.Mock).mockResolvedValue(undefined);

      // Act & Assert
      await expect(
        focusRepository.completeSession('non-existent', true),
      ).resolves.not.toThrow();
    });
  });

  describe('getStats', () => {
    it('should calculate today stats correctly', async () => {
      // Arrange
      const now = Date.now();
      const todaySession = {
        ...mockSession,
        startTime: now,
        completed: true,
        duration: 1800,
      };
      const sessionMap = { [todaySession.id]: todaySession };
      (storageService.getItem as jest.Mock).mockResolvedValue(sessionMap);

      // Act
      const result = await focusRepository.getStats();

      // Assert
      expect(result).toHaveProperty('today');
      expect(result).toHaveProperty('thisWeek');
      expect(result).toHaveProperty('totalSessions');
      expect(result.totalSessions).toBe(1);
    });

    it('should return zero stats when no sessions', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await focusRepository.getStats();

      // Assert
      expect(result.today).toBe(0);
      expect(result.thisWeek).toHaveLength(7);
      expect(result.totalSessions).toBe(0);
    });

    it('should only count completed sessions', async () => {
      // Arrange
      const completedSession = {
        ...mockSession,
        id: 'session-1',
        completed: true,
      };
      const incompleteSession = {
        ...mockSession,
        id: 'session-2',
        completed: false,
      };
      const sessionMap = {
        [completedSession.id]: completedSession,
        [incompleteSession.id]: incompleteSession,
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(sessionMap);

      // Act
      const result = await focusRepository.getStats();

      // Assert
      expect(result.totalSessions).toBe(1);
    });
  });

  describe('getAllSessions', () => {
    it('should return all sessions sorted by start time descending', async () => {
      // Arrange
      const session1 = { ...mockSession, id: 'focus_1', startTime: 1000 };
      const session2 = { ...mockSession, id: 'focus_2', startTime: 2000 };
      const session3 = { ...mockSession, id: 'focus_3', startTime: 1500 };
      const sessionMap = {
        [session1.id]: session1,
        [session2.id]: session2,
        [session3.id]: session3,
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(sessionMap);

      // Act
      const result = await focusRepository.getAllSessions();

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('focus_2'); // Most recent
      expect(result[1].id).toBe('focus_3');
      expect(result[2].id).toBe('focus_1'); // Oldest
    });

    it('should return empty array when no sessions exist', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await focusRepository.getAllSessions();

      // Assert
      expect(result).toEqual([]);
    });
  });
});
