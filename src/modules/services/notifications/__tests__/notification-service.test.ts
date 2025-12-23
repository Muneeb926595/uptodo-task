/**
 * Notification Service Test Suite
 *
 * Tests notification scheduling and focus mode functionality
 */

import NotificationService from '../notification-service';
import { NotificationAdapter } from '../notification-adapter';
import { storageService, StorageKeys } from '../../storage';
import { Todo } from '../../../todo/types';

// Mock dependencies
jest.mock('../../storage', () => ({
  storageService: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
  StorageKeys: {
    SUPPRESSED_NOTIFICATIONS: 'suppressed-notifications',
  },
}));

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockAdapter: jest.Mocked<NotificationAdapter>;

  const mockTodo: Partial<Todo> = {
    id: 'todo-1',
    title: 'Test Todo',
    description: 'Test description',
    isCompleted: false,
    dueDate: Date.now() + 3600000, // 1 hour from now
    categoryId: 'cat-1',
    priority: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    notificationId: 'notif-1',
    timezone: 'UTC',
    status: 'PENDING',
    hasSubTasks: false,
  } as Todo;

  beforeEach(() => {
    // Create mock adapter
    mockAdapter = {
      requestPermission: jest.fn(),
      schedule: jest.fn(),
      cancel: jest.fn(),
      cancelAll: jest.fn(),
      getScheduledIds: jest.fn(),
    };

    notificationService = new NotificationService(mockAdapter);
    jest.clearAllMocks();
  });

  describe('ensurePermissions', () => {
    it('should request notification permissions', async () => {
      // Arrange
      mockAdapter.requestPermission.mockResolvedValue(true);

      // Act
      const result = await notificationService.ensurePermissions();

      // Assert
      expect(mockAdapter.requestPermission).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if permission denied', async () => {
      // Arrange
      mockAdapter.requestPermission.mockResolvedValue(false);

      // Act
      const result = await notificationService.ensurePermissions();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('scheduleForTodo', () => {
    it('should schedule notification for incomplete todo', async () => {
      // Arrange
      mockAdapter.schedule.mockResolvedValue('notif-123');

      // Act
      const result = await notificationService.scheduleForTodo(
        mockTodo as Todo,
      );

      // Assert
      expect(mockAdapter.schedule).toHaveBeenCalledWith({
        id: mockTodo.id,
        title: 'Todo Due',
        body: mockTodo.title,
        timestamp: mockTodo.dueDate,
      });
      expect(result).toBe('notif-123');
    });

    it('should not schedule for completed todo', async () => {
      // Arrange
      const completedTodo = { ...mockTodo, isCompleted: true } as Todo;

      // Act
      const result = await notificationService.scheduleForTodo(completedTodo);

      // Assert
      expect(mockAdapter.schedule).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should not schedule for deleted todo', async () => {
      // Arrange
      const deletedTodo = { ...mockTodo, deletedAt: Date.now() } as Todo;

      // Act
      const result = await notificationService.scheduleForTodo(deletedTodo);

      // Assert
      expect(mockAdapter.schedule).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should not schedule for past due date', async () => {
      // Arrange
      const pastTodo = { ...mockTodo, dueDate: Date.now() - 3600000 } as Todo;

      // Act
      const result = await notificationService.scheduleForTodo(pastTodo);

      // Assert
      expect(mockAdapter.schedule).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('rescheduleTodo', () => {
    it('should cancel existing and schedule new notification', async () => {
      // Arrange
      mockAdapter.schedule.mockResolvedValue('notif-456');

      // Act
      const result = await notificationService.rescheduleTodo(mockTodo as Todo);

      // Assert
      expect(mockAdapter.cancel).toHaveBeenCalledWith(mockTodo.notificationId);
      expect(mockAdapter.schedule).toHaveBeenCalled();
      expect(result).toBe('notif-456');
    });

    it('should only schedule if no existing notification', async () => {
      // Arrange
      const todoWithoutNotif = {
        ...mockTodo,
        notificationId: undefined,
      } as Todo;
      mockAdapter.schedule.mockResolvedValue('notif-789');

      // Act
      const result = await notificationService.rescheduleTodo(todoWithoutNotif);

      // Assert
      expect(mockAdapter.cancel).not.toHaveBeenCalled();
      expect(mockAdapter.schedule).toHaveBeenCalled();
      expect(result).toBe('notif-789');
    });

    it('should not reschedule completed todo', async () => {
      // Arrange
      const completedTodo = { ...mockTodo, isCompleted: true } as Todo;

      // Act
      const result = await notificationService.rescheduleTodo(completedTodo);

      // Assert
      expect(mockAdapter.cancel).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('cancelForTodo', () => {
    it('should cancel notification for todo', async () => {
      // Act
      await notificationService.cancelForTodo(mockTodo as Todo);

      // Assert
      expect(mockAdapter.cancel).toHaveBeenCalledWith(mockTodo.notificationId);
    });

    it('should not cancel if no notification ID', async () => {
      // Arrange
      const todoWithoutNotif = {
        ...mockTodo,
        notificationId: undefined,
      } as Todo;

      // Act
      await notificationService.cancelForTodo(todoWithoutNotif);

      // Assert
      expect(mockAdapter.cancel).not.toHaveBeenCalled();
    });
  });

  describe('resyncAll', () => {
    it('should cancel all and reschedule active todos', async () => {
      // Arrange
      const todos: Todo[] = [
        mockTodo as Todo,
        { ...mockTodo, id: 'todo-2', isCompleted: true } as Todo,
        {
          ...mockTodo,
          id: 'todo-3',
          dueDate: Date.now() + 7200000,
        } as Todo,
      ];
      mockAdapter.schedule.mockResolvedValue('notif-new');

      // Act
      await notificationService.resyncAll(todos);

      // Assert
      expect(mockAdapter.cancelAll).toHaveBeenCalled();
      expect(mockAdapter.schedule).toHaveBeenCalledTimes(2); // Only 2 active todos
    });

    it('should not schedule completed or deleted todos', async () => {
      // Arrange
      const todos: Todo[] = [
        { ...mockTodo, isCompleted: true } as Todo,
        { ...mockTodo, id: 'todo-2', deletedAt: Date.now() } as Todo,
        { ...mockTodo, id: 'todo-3', dueDate: Date.now() - 1000 } as Todo, // Past due
      ];

      // Act
      await notificationService.resyncAll(todos);

      // Assert
      expect(mockAdapter.cancelAll).toHaveBeenCalled();
      expect(mockAdapter.schedule).not.toHaveBeenCalled();
    });
  });

  describe('suppressNotifications', () => {
    it('should suppress notifications during focus session', async () => {
      // Arrange
      const now = Date.now();
      const focusEndTime = now + 3600000; // 1 hour focus session
      const todos: Todo[] = [
        { ...mockTodo, id: 'todo-1', dueDate: now + 1800000 } as Todo, // 30 min
        { ...mockTodo, id: 'todo-2', dueDate: now + 7200000 } as Todo, // 2 hours (after focus)
      ];
      mockAdapter.getScheduledIds.mockResolvedValue(['todo-1', 'todo-2']);

      // Act
      await notificationService.suppressNotifications(todos, focusEndTime);

      // Assert
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.SUPPRESSED_NOTIFICATIONS,
        expect.arrayContaining([
          expect.objectContaining({
            id: 'todo-1',
            todoId: 'todo-1',
          }),
        ]),
      );
      expect(mockAdapter.cancel).toHaveBeenCalledWith('todo-1');
      expect(mockAdapter.cancel).not.toHaveBeenCalledWith('todo-2');
    });

    it('should not suppress past notifications', async () => {
      // Arrange
      const now = Date.now();
      const focusEndTime = now + 3600000;
      const todos: Todo[] = [
        { ...mockTodo, id: 'todo-1', dueDate: now - 1000 } as Todo, // Past
      ];
      mockAdapter.getScheduledIds.mockResolvedValue(['todo-1']);

      // Act
      await notificationService.suppressNotifications(todos, focusEndTime);

      // Assert
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.SUPPRESSED_NOTIFICATIONS,
        [],
      );
      expect(mockAdapter.cancel).not.toHaveBeenCalled();
    });

    it('should not suppress completed todos', async () => {
      // Arrange
      const now = Date.now();
      const focusEndTime = now + 3600000;
      const todos: Todo[] = [
        {
          ...mockTodo,
          id: 'todo-1',
          dueDate: now + 1800000,
          isCompleted: true,
        } as Todo,
      ];
      mockAdapter.getScheduledIds.mockResolvedValue(['todo-1']);

      // Act
      await notificationService.suppressNotifications(todos, focusEndTime);

      // Assert
      expect(mockAdapter.cancel).not.toHaveBeenCalled();
    });
  });

  describe('restoreNotifications', () => {
    it('should restore valid suppressed notifications', async () => {
      // Arrange
      const now = Date.now();
      const saved = [
        {
          id: 'todo-1',
          todoId: 'todo-1',
          title: 'Todo Due',
          body: 'Test Todo',
          timestamp: now + 1800000, // Future
        },
        {
          id: 'todo-2',
          todoId: 'todo-2',
          title: 'Todo Due',
          body: 'Past Todo',
          timestamp: now - 1000, // Past
        },
      ];
      (storageService.getItem as jest.Mock).mockResolvedValue(saved);

      // Act
      await notificationService.restoreNotifications();

      // Assert
      expect(mockAdapter.schedule).toHaveBeenCalledTimes(1); // Only future one
      expect(mockAdapter.schedule).toHaveBeenCalledWith({
        id: 'todo-1',
        title: 'Todo Due',
        body: 'Test Todo',
        timestamp: saved[0].timestamp,
      });
      expect(storageService.removeItem).toHaveBeenCalledWith(
        StorageKeys.SUPPRESSED_NOTIFICATIONS,
      );
    });

    it('should do nothing if no saved notifications', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue([]);

      // Act
      await notificationService.restoreNotifications();

      // Assert
      expect(mockAdapter.schedule).not.toHaveBeenCalled();
      expect(storageService.removeItem).not.toHaveBeenCalled();
    });

    it('should handle null saved notifications', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      await notificationService.restoreNotifications();

      // Assert
      expect(mockAdapter.schedule).not.toHaveBeenCalled();
    });
  });

  describe('areNotificationsSuppressed', () => {
    it('should return true if notifications are suppressed', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue([
        { id: 'todo-1', todoId: 'todo-1' },
      ]);

      // Act
      const result = await notificationService.areNotificationsSuppressed();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if no suppressed notifications', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await notificationService.areNotificationsSuppressed();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false if null saved notifications', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await notificationService.areNotificationsSuppressed();

      // Assert
      expect(result).toBe(false);
    });
  });
});
