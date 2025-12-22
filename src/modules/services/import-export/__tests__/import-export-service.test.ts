/**
 * Import/Export Service Test Suite
 * 
 * Tests import and export functionality for todos and categories
 */

import RNFS from 'react-native-fs';
import { Platform, Share, Alert } from 'react-native';
import { importExportService, ExportData } from '../import-export-service';
import { Todo } from '../../../todo/types/todo.types';
import { Category } from '../../../categories/types/categories.types';

// Mock dependencies
jest.mock('react-native-fs');
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
  Share: {
    share: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
}));

describe('ImportExportService', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Description 1',
      isCompleted: false,
      dueDate: Date.now(),
      categoryId: 'cat-1',
      priority: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      timezone: 'UTC',
      status: 'PENDING',
      hasSubTasks: false,
    } as Todo,
    {
      id: '2',
      title: 'Test Todo 2',
      description: 'Description 2',
      isCompleted: true,
      dueDate: Date.now(),
      categoryId: 'cat-2',
      priority: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      timezone: 'UTC',
      status: 'COMPLETED',
      hasSubTasks: false,
    } as Todo,
  ];

  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Work',
      icon: 'briefcase',
      color: '#FF0000',
    } as Category,
    {
      id: 'cat-2',
      name: 'Personal',
      icon: 'user',
      color: '#00FF00',
    } as Category,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (RNFS.writeFile as jest.Mock).mockResolvedValue(undefined);
    (RNFS.unlink as jest.Mock).mockResolvedValue(undefined);
    (Share.share as jest.Mock).mockResolvedValue({ action: 'sharedAction' });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('exportTodos', () => {
    it('should export todos on iOS using Share API', async () => {
      // Arrange
      Platform.OS = 'ios';

      // Act
      await importExportService.exportTodos(mockTodos, mockCategories);

      // Assert
      expect(RNFS.writeFile).toHaveBeenCalled();
      const writeCall = (RNFS.writeFile as jest.Mock).mock.calls[0];
      expect(writeCall[0]).toContain(RNFS.TemporaryDirectoryPath);
      expect(writeCall[0]).toContain('uptodo-backup');
      expect(writeCall[2]).toBe('utf8');

      const exportData = JSON.parse(writeCall[1]);
      expect(exportData.version).toBe('1.0');
      expect(exportData.todos).toHaveLength(2);
      expect(exportData.categories).toHaveLength(2);
      expect(exportData.exportDate).toBeDefined();

      expect(Share.share).toHaveBeenCalledWith({
        url: expect.stringContaining('file://'),
        message: 'UpTodo Backup',
        title: 'Export Todos',
      });
    });

    it('should remove derived fields from todos', async () => {
      // Arrange
      const todosWithDerived = [
        {
          ...mockTodos[0],
          category: mockCategories[0], // Derived field
          isOverdue: true, // Derived field
        },
      ] as any;

      // Act
      await importExportService.exportTodos(todosWithDerived);

      // Assert
      const writeCall = (RNFS.writeFile as jest.Mock).mock.calls[0];
      const exportData = JSON.parse(writeCall[1]);
      expect(exportData.todos[0].category).toBeUndefined();
      expect(exportData.todos[0].isOverdue).toBeUndefined();
    });

    it('should export todos on Android and show alert', async () => {
      // Arrange
      Platform.OS = 'android';
      const alertMock = jest.fn();
      (Alert.alert as jest.Mock) = alertMock;

      // Act
      await importExportService.exportTodos(mockTodos, mockCategories);

      // Assert
      expect(RNFS.writeFile).toHaveBeenCalled();
      const writeCall = (RNFS.writeFile as jest.Mock).mock.calls[0];
      expect(writeCall[0]).toContain(RNFS.DownloadDirectoryPath);

      expect(alertMock).toHaveBeenCalledWith(
        'Export Successful',
        expect.stringContaining('exported to'),
        expect.arrayContaining([
          expect.objectContaining({ text: 'Share' }),
          expect.objectContaining({ text: 'OK' }),
        ]),
      );
    });

    it('should handle export errors', async () => {
      // Arrange
      (RNFS.writeFile as jest.Mock).mockRejectedValue(
        new Error('Write failed'),
      );

      // Act & Assert
      await expect(
        importExportService.exportTodos(mockTodos),
      ).rejects.toThrow('Failed to export todos. Please try again.');
    });

    it('should clean up temporary file on iOS after delay', async () => {
      // Arrange
      Platform.OS = 'ios';

      // Act
      await importExportService.exportTodos(mockTodos);

      // Fast-forward timers and run all pending timers
      jest.runAllTimers();

      // Assert
      expect(RNFS.unlink).toHaveBeenCalled();
    }, 10000);

    it('should generate filename with current date', async () => {
      // Arrange
      const realDate = Date;
      const mockDate = new Date('2024-01-15');
      globalThis.Date = jest.fn(() => mockDate) as any;
      globalThis.Date.now = realDate.now;

      // Act
      await importExportService.exportTodos(mockTodos);

      // Assert
      const writeCall = (RNFS.writeFile as jest.Mock).mock.calls[0];
      expect(writeCall[0]).toContain('uptodo-backup-2024-01-15.json');

      // Cleanup
      globalThis.Date = realDate;
    });
  });

  describe('importTodos', () => {
    const validExportData: ExportData = {
      version: '1.0',
      exportDate: Date.now(),
      todos: mockTodos,
      categories: mockCategories,
    };

    it('should import valid todos from file', async () => {
      // Arrange
      const fileUri = '/path/to/backup.json';
      (RNFS.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify(validExportData),
      );

      // Act
      const result = await importExportService.importTodos(fileUri);

      // Assert
      expect(RNFS.readFile).toHaveBeenCalledWith(fileUri, 'utf8');
      expect(result).toEqual(validExportData);
      expect(result.todos).toHaveLength(2);
      expect(result.categories).toHaveLength(2);
    });

    it('should throw error for invalid JSON', async () => {
      // Arrange
      const fileUri = '/path/to/invalid.json';
      (RNFS.readFile as jest.Mock).mockResolvedValue('invalid json{');

      // Act & Assert
      await expect(importExportService.importTodos(fileUri)).rejects.toThrow(
        'Invalid JSON file. Please select a valid backup file.',
      );
    });

    it('should throw error for missing version', async () => {
      // Arrange
      const invalidData = { todos: mockTodos };
      (RNFS.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidData),
      );
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      // Act & Assert
      await expect(
        importExportService.importTodos('/path/to/file.json'),
      ).rejects.toThrow('Failed to import todos. Please try again.');

      // Verify the validation error was caught
      expect(consoleError).toHaveBeenCalledWith(
        'Import error:',
        expect.any(Error),
      );

      consoleError.mockRestore();
    });

    it('should throw error for missing todos array', async () => {
      // Arrange
      const invalidData = { version: '1.0', exportDate: Date.now() };
      (RNFS.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidData),
      );
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      // Act & Assert
      await expect(
        importExportService.importTodos('/path/to/file.json'),
      ).rejects.toThrow('Failed to import todos. Please try again.');

      // Verify the validation error was caught
      expect(consoleError).toHaveBeenCalledWith(
        'Import error:',
        expect.any(Error),
      );

      consoleError.mockRestore();
    });

    it('should warn about version mismatch', async () => {
      // Arrange
      const oldVersionData = {
        ...validExportData,
        version: '0.9',
      };
      (RNFS.readFile as jest.Mock).mockResolvedValue(
        JSON.stringify(oldVersionData),
      );
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      await importExportService.importTodos('/path/to/file.json');

      // Assert
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('version 0.9 differs from current 1.0'),
      );

      consoleWarn.mockRestore();
    });

    it('should handle read file errors', async () => {
      // Arrange
      (RNFS.readFile as jest.Mock).mockRejectedValue(
        new Error('File not found'),
      );

      // Act & Assert
      await expect(
        importExportService.importTodos('/path/to/file.json'),
      ).rejects.toThrow('Failed to import todos. Please try again.');
    });
  });

  describe('getExportSummary', () => {
    it('should generate summary with todos and categories', () => {
      // Arrange
      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date('2024-01-15').getTime(),
        todos: mockTodos,
        categories: mockCategories,
      };

      // Act
      const summary = importExportService.getExportSummary(exportData);

      // Assert
      expect(summary).toContain('2 todos');
      expect(summary).toContain('2 categories');
      expect(summary).toContain('1/15/2024');
    });

    it('should generate summary without categories', () => {
      // Arrange
      const exportData: ExportData = {
        version: '1.0',
        exportDate: Date.now(),
        todos: mockTodos,
      };

      // Act
      const summary = importExportService.getExportSummary(exportData);

      // Assert
      expect(summary).toContain('2 todos');
      expect(summary).not.toContain('categories');
    });
  });

  describe('validateImportData', () => {
    it('should validate valid data', () => {
      // Arrange
      const validData: ExportData = {
        version: '1.0',
        exportDate: Date.now(),
        todos: mockTodos,
        categories: mockCategories,
      };

      // Act
      const result = importExportService.validateImportData(validData);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect empty todos array', () => {
      // Arrange
      const emptyData: ExportData = {
        version: '1.0',
        exportDate: Date.now(),
        todos: [],
      };

      // Act
      const result = importExportService.validateImportData(emptyData);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No todos found in backup file');
    });

    it('should detect missing todo IDs', () => {
      // Arrange
      const invalidTodos = [{ title: 'Todo without ID' }] as any;
      const invalidData: ExportData = {
        version: '1.0',
        exportDate: Date.now(),
        todos: invalidTodos,
      };

      // Act
      const result = importExportService.validateImportData(invalidData);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Todo at index 0 is missing an ID');
    });

    it('should detect missing todo titles', () => {
      // Arrange
      const invalidTodos = [{ id: '1' }] as any;
      const invalidData: ExportData = {
        version: '1.0',
        exportDate: Date.now(),
        todos: invalidTodos,
      };

      // Act
      const result = importExportService.validateImportData(invalidData);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Todo at index 0 is missing a title');
    });

    it('should detect multiple validation errors', () => {
      // Arrange
      const invalidTodos = [
        { title: 'No ID' },
        { id: '2' },
        { id: '3', title: 'Valid' },
      ] as any;
      const invalidData: ExportData = {
        version: '1.0',
        exportDate: Date.now(),
        todos: invalidTodos,
      };

      // Act
      const result = importExportService.validateImportData(invalidData);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
