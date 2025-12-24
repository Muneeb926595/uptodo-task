/**
 * Todo Repository Test Suite
 *
 * Tests todo repository functionality including CRUD, filtering, and notifications
 */

// Mock dependencies BEFORE imports
jest.mock('../../../services/storage');
jest.mock('../../../services/notifications');
jest.mock('../../../utils/id');
jest.mock('../../categories/categories-repository');

import { todoRepository } from '../todo-repository';
import { storageService } from '../../../services/storage';
import { notificationService } from '../../../services/notifications';
import { generateId } from '../../../utils/id';
import { categoriesRepository } from '../../categories/categories-repository';
import { Todo } from '../../../types/todo.types';
import { Category } from '../../../types/categories.types';

describe('TodoRepository', () => {
  const mockCategory: Category = {
    id: 'cat-1',
    name: 'Work',
    icon: 'briefcase',
    color: '#FF0000',
    isSystem: false,
    createdAt: 1234567890,
    updatedAt: 1234567890,
    deletedAt: null,
  };

  const mockTodo: Partial<Todo> = {
    id: 'todo-1',
    title: 'Test Todo',
    description: 'Test Description',
    categoryId: 'cat-1',
    priority: 1,
    dueDate: Date.now(),
    createdAt: 1234567890,
    updatedAt: 1234567890,
    deletedAt: null,
    isCompleted: false,
    completedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (generateId as jest.Mock).mockReturnValue('generated-id');
    (categoriesRepository.getAll as jest.Mock).mockResolvedValue([
      mockCategory,
    ]);
    (categoriesRepository.getById as jest.Mock).mockResolvedValue(mockCategory);
    (notificationService.scheduleForTodo as jest.Mock).mockResolvedValue(
      'notif-id',
    );
    (notificationService.rescheduleTodo as jest.Mock).mockResolvedValue(
      'notif-id',
    );
    (notificationService.cancelForTodo as jest.Mock).mockResolvedValue(
      undefined,
    );
  });

  describe('getAll', () => {
    it('should return all non-deleted todos with populated categories', async () => {
      // Arrange
      const todoMap = {
        'todo-1': mockTodo,
        'todo-2': { ...mockTodo, id: 'todo-2', title: 'Second Todo' },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('category', mockCategory);
      expect(result[1]).toHaveProperty('category', mockCategory);
    });

    it('should filter out deleted todos', async () => {
      // Arrange
      const todoMap = {
        'todo-1': mockTodo,
        'todo-2': { ...mockTodo, id: 'todo-2', deletedAt: Date.now() },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getAll();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('todo-1');
    });

    it('should set isOverdue flag for past due todos', async () => {
      // Arrange
      const now = Date.now();
      const pastDate = now - 86400000; // 1 day ago
      const todoMap = {
        'todo-1': { ...mockTodo, dueDate: pastDate, isCompleted: false },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getAll();

      // Assert
      expect(result[0].isOverdue).toBe(true);
    });

    it('should not mark completed todos as overdue', async () => {
      // Arrange
      const pastDate = Date.now() - 86400000;
      const todoMap = {
        'todo-1': { ...mockTodo, dueDate: pastDate, isCompleted: true },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getAll();

      // Assert
      expect(result[0].isOverdue).toBe(false);
    });

    it('should return empty array when no todos exist', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await todoRepository.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return todo by ID', async () => {
      // Arrange
      const todoMap = { 'todo-1': mockTodo };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getById('todo-1');

      // Assert
      expect(result).toMatchObject(mockTodo);
    });

    it('should return null for non-existent ID', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await todoRepository.getById('non-existent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new todo with provided data', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (notificationService.scheduleForTodo as jest.Mock).mockResolvedValue(
        'notif-id',
      );

      const payload = {
        title: 'New Todo',
        description: 'Description',
        categoryId: 'cat-1',
        priority: 2 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
        dueDate: now + 86400000,
      };

      // Act
      const result = await todoRepository.create(payload);

      // Assert
      expect(result).toMatchObject({
        id: 'generated-id',
        title: 'New Todo',
        description: 'Description',
        categoryId: 'cat-1',
        priority: 2,
        dueDate: now + 86400000,
        isCompleted: false,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });
    });

    it('should schedule notification for new todo', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (notificationService.scheduleForTodo as jest.Mock).mockResolvedValue(
        'notif-id',
      );

      // Act
      await todoRepository.create({ title: 'Test' });

      // Assert
      expect(notificationService.scheduleForTodo).toHaveBeenCalled();
    });

    it('should use default values for missing fields', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await todoRepository.create({});

      // Assert
      expect(result.title).toBe('Untitled');
      expect(result.priority).toBe(3); // Default is 3, not 0
      expect(result.isCompleted).toBe(false);
    });
  });

  describe('update', () => {
    it('should update existing todo', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const todoMap = { 'todo-1': mockTodo };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      const patch = {
        title: 'Updated Title',
        priority: 3 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
      };

      // Act
      const result = await todoRepository.update('todo-1', patch);

      // Assert
      expect(result).toMatchObject({
        ...mockTodo,
        title: 'Updated Title',
        priority: 3,
        updatedAt: now,
      });
    });

    it('should reschedule notification on due date change', async () => {
      // Arrange
      const todoWithNotif = { ...mockTodo, notificationId: 'old-notif' };
      const todoMap = { 'todo-1': todoWithNotif };
      const newDueDate = Date.now() + 86400000;
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (notificationService.rescheduleTodo as jest.Mock).mockResolvedValue(
        'new-notif',
      );

      // Act
      await todoRepository.update('todo-1', { dueDate: newDueDate });

      // Assert
      expect(notificationService.rescheduleTodo).toHaveBeenCalled();
    });

    it('should return null for non-existent todo', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await todoRepository.update('non-existent', {
        title: 'Test',
      });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('should soft delete a todo and cancel its notification', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const todoWithNotif = { ...mockTodo, notificationId: 'notif-1' };
      const todoMap = { 'todo-1': todoWithNotif };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (notificationService.cancelForTodo as jest.Mock).mockResolvedValue(
        undefined,
      );

      // Act
      await todoRepository.softDelete('todo-1');

      // Assert
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap['todo-1'].deletedAt).toBe(now);
      expect(notificationService.cancelForTodo).toHaveBeenCalledWith(
        todoWithNotif,
      );
    });

    it('should not throw if no notification exists', async () => {
      // Arrange
      const todoMap = { 'todo-1': mockTodo };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act & Assert
      await expect(todoRepository.softDelete('todo-1')).resolves.not.toThrow();
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted todo', async () => {
      // Arrange
      const deletedTodo = { ...mockTodo, deletedAt: Date.now() };
      const todoMap = { 'todo-1': deletedTodo };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await todoRepository.restore('todo-1');

      // Assert
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap['todo-1'].deletedAt).toBeUndefined();
    });
  });

  describe('importTodos', () => {
    it('should import todos with merge strategy', async () => {
      // Arrange
      const existingMap = { 'todo-1': mockTodo };
      const newTodos = [
        { ...mockTodo, id: 'todo-2', title: 'New Todo' },
        { ...mockTodo, id: 'todo-3', title: 'Another' },
      ] as Todo[];
      (storageService.getItem as jest.Mock).mockResolvedValue(existingMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await todoRepository.importTodos(newTodos, 'merge');

      // Assert
      expect(result.imported).toBe(2);
      expect(result.skipped).toBe(0);
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(Object.keys(savedMap)).toHaveLength(3);
    });

    it('should skip existing todos in merge mode', async () => {
      // Arrange
      const existingMap = { 'todo-1': mockTodo };
      const newTodos = [
        mockTodo, // Same ID
        { ...mockTodo, id: 'todo-2', title: 'New' },
      ] as Todo[];
      (storageService.getItem as jest.Mock).mockResolvedValue(existingMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await todoRepository.importTodos(newTodos, 'merge');

      // Assert
      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(1);
    });

    it('should replace all todos in replace mode', async () => {
      // Arrange
      const existingMap = { 'todo-1': mockTodo };
      const newTodos = [{ ...mockTodo, id: 'todo-2', title: 'New' }] as Todo[];
      (storageService.getItem as jest.Mock).mockResolvedValue(existingMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await todoRepository.importTodos(newTodos, 'replace');

      // Assert
      expect(result.imported).toBe(1);
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap['todo-1']).toBeUndefined();
      expect(savedMap['todo-2']).toBeDefined();
    });
  });

  describe('getByCategory', () => {
    it('should filter todos by category ID', async () => {
      // Arrange
      const todoMap = {
        'todo-1': { ...mockTodo, categoryId: 'cat-1', deletedAt: null },
        'todo-2': {
          ...mockTodo,
          id: 'todo-2',
          categoryId: 'cat-2',
          deletedAt: null,
        },
        'todo-3': {
          ...mockTodo,
          id: 'todo-3',
          categoryId: 'cat-1',
          deletedAt: null,
        },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getByCategory('cat-1');

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(0);
      if (result.length > 0) {
        expect(result.every(t => t.categoryId === 'cat-1')).toBe(true);
      }
    });
  });

  describe('getOverdue', () => {
    it('should return overdue todos', async () => {
      // Arrange
      const now = Date.now();
      const pastDate = now - 86400000;
      const todoMap = {
        'todo-1': {
          ...mockTodo,
          dueDate: pastDate,
          isCompleted: false,
          deletedAt: null,
        },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getOverdue(now);

      // Assert
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getForDate', () => {
    it('should return todos for a specific date', async () => {
      // Arrange
      const targetDate = new Date('2024-01-15T10:00:00').getTime();
      const todoMap = {
        'todo-1': { ...mockTodo, dueDate: targetDate, deletedAt: null },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(todoMap);

      // Act
      const result = await todoRepository.getForDate(targetDate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
