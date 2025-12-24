/**
 * Categories Repository Test Suite
 *
 * Tests categories repository functionality
 */

// Mock dependencies BEFORE imports
jest.mock('../../../services/storage');
jest.mock('../../../utils/id');

import { categoriesRepository } from '../categories-repository';
import { storageService, StorageKeys } from '../../../services/storage';
import { generateId } from '../../../utils/id';
import { Category } from '../../../types/categories.types';

describe('CategoriesRepository', () => {
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

  const mockSystemCategory: Category = {
    id: 'cat-system',
    name: 'System',
    icon: 'system',
    color: '#000000',
    isSystem: true,
    createdAt: 1234567890,
    updatedAt: 1234567890,
    deletedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (generateId as jest.Mock).mockReturnValue('generated-id');
  });

  describe('getAll', () => {
    it('should return all non-deleted categories sorted by name', async () => {
      // Arrange
      const categoryMap = {
        'cat-1': { ...mockCategory, name: 'Zebra' },
        'cat-2': { ...mockCategory, id: 'cat-2', name: 'Apple' },
        'cat-3': { ...mockCategory, id: 'cat-3', name: 'Middle' },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(categoryMap);

      // Act
      const result = await categoriesRepository.getAll();

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Apple');
      expect(result[1].name).toBe('Middle');
      expect(result[2].name).toBe('Zebra');
    });

    it('should filter out deleted categories', async () => {
      // Arrange
      const categoryMap = {
        'cat-1': mockCategory,
        'cat-2': { ...mockCategory, id: 'cat-2', deletedAt: Date.now() },
        'cat-3': { ...mockCategory, id: 'cat-3' },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(categoryMap);

      // Act
      const result = await categoriesRepository.getAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result.find(c => c.id === 'cat-2')).toBeUndefined();
    });

    it('should return empty array when no categories exist', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await categoriesRepository.getAll();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle null storage value', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await categoriesRepository.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return category by ID', async () => {
      // Arrange
      const categoryMap = {
        'cat-1': mockCategory,
        'cat-2': { ...mockCategory, id: 'cat-2' },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(categoryMap);

      // Act
      const result = await categoriesRepository.getById('cat-1');

      // Assert
      expect(result).toEqual(mockCategory);
    });

    it('should return null for non-existent ID', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await categoriesRepository.getById('non-existent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new category with provided data', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);
      (generateId as jest.Mock).mockReturnValue('new-id');

      const payload = {
        name: 'New Category',
        icon: 'icon-name',
        color: '#00FF00',
      };

      // Act
      const result = await categoriesRepository.create(payload);

      // Assert
      expect(result).toEqual({
        id: 'new-id',
        name: 'New Category',
        icon: 'icon-name',
        color: '#00FF00',
        isSystem: false,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });
      expect(storageService.setItem).toHaveBeenCalledWith(
        StorageKeys.CATEGORIES,
        expect.objectContaining({
          'new-id': expect.any(Object),
        }),
      );
    });

    it('should use provided ID if given', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      const payload = {
        id: 'custom-id',
        name: 'Custom',
      };

      // Act
      const result = await categoriesRepository.create(payload);

      // Assert
      expect(result.id).toBe('custom-id');
      expect(generateId).not.toHaveBeenCalled();
    });

    it('should use default values for missing fields', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await categoriesRepository.create({});

      // Assert
      expect(result.name).toBe('Untitled');
      expect(result.color).toBe('#6C5CE7');
      expect(result.isSystem).toBe(false);
      expect(result.icon).toBeUndefined();
    });

    it('should preserve isSystem flag', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await categoriesRepository.create({
        name: 'System Cat',
        isSystem: true,
      });

      // Assert
      expect(result.isSystem).toBe(true);
    });
  });

  describe('update', () => {
    it('should update existing category', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const categoryMap = {
        'cat-1': mockCategory,
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(categoryMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      const patch = {
        name: 'Updated Name',
        color: '#0000FF',
      };

      // Act
      const result = await categoriesRepository.update('cat-1', patch);

      // Assert
      expect(result).toEqual({
        ...mockCategory,
        name: 'Updated Name',
        color: '#0000FF',
        updatedAt: now,
      });
      expect(storageService.setItem).toHaveBeenCalled();
    });

    it('should return null for non-existent category', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});

      // Act
      const result = await categoriesRepository.update('non-existent', {
        name: 'New Name',
      });

      // Assert
      expect(result).toBeNull();
      expect(storageService.setItem).not.toHaveBeenCalled();
    });

    it('should preserve fields not in patch', async () => {
      // Arrange
      const categoryMap = {
        'cat-1': mockCategory,
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(categoryMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await categoriesRepository.update('cat-1', {
        name: 'Updated',
      });

      // Assert
      expect(result?.icon).toBe(mockCategory.icon);
      expect(result?.color).toBe(mockCategory.color);
      expect(result?.isSystem).toBe(mockCategory.isSystem);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a category', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const categoryMap = {
        'cat-1': { ...mockCategory },
      };
      (storageService.getItem as jest.Mock).mockResolvedValue(categoryMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await categoriesRepository.softDelete('cat-1');

      // Assert
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap['cat-1'].deletedAt).toBe(now);
      expect(savedMap['cat-1'].updatedAt).toBe(now);
    });

    it('should do nothing for non-existent category', async () => {
      // Arrange
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      await categoriesRepository.softDelete('non-existent');

      // Assert
      expect(storageService.setItem).not.toHaveBeenCalled();
    });
  });

  describe('importCategories', () => {
    it('should import categories with merge strategy', async () => {
      // Arrange
      const existingMap = {
        'cat-1': mockCategory,
      };
      const newCategories = [
        { ...mockCategory, id: 'cat-2', name: 'New Category' },
        { ...mockCategory, id: 'cat-3', name: 'Another' },
      ];
      (storageService.getItem as jest.Mock).mockResolvedValue(existingMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await categoriesRepository.importCategories(
        newCategories,
        'merge',
      );

      // Assert
      expect(result.imported).toBe(2);
      expect(result.skipped).toBe(0);
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(Object.keys(savedMap)).toHaveLength(3);
    });

    it('should skip existing categories in merge mode', async () => {
      // Arrange
      const existingMap = {
        'cat-1': mockCategory,
      };
      const newCategories = [
        { ...mockCategory }, // Same ID as existing
        { ...mockCategory, id: 'cat-2', name: 'New' },
      ];
      (storageService.getItem as jest.Mock).mockResolvedValue(existingMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await categoriesRepository.importCategories(
        newCategories,
        'merge',
      );

      // Assert
      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(1);
    });

    it('should replace all non-system categories in replace mode', async () => {
      // Arrange
      const existingMap = {
        'cat-1': mockCategory,
        'cat-system': mockSystemCategory,
      };
      const newCategories = [{ ...mockCategory, id: 'cat-2', name: 'New' }];
      (storageService.getItem as jest.Mock).mockResolvedValue(existingMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await categoriesRepository.importCategories(
        newCategories,
        'replace',
      );

      // Assert
      expect(result.imported).toBe(1);
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap['cat-1']).toBeUndefined(); // Removed
      expect(savedMap['cat-system']).toBeDefined(); // System category preserved
      expect(savedMap['cat-2']).toBeDefined(); // New category added
    });

    it('should not overwrite system categories', async () => {
      // Arrange
      const existingMap = {
        'cat-system': mockSystemCategory,
      };
      const newCategories = [
        { ...mockCategory, id: 'cat-system', name: 'Trying to overwrite' },
      ];
      (storageService.getItem as jest.Mock).mockResolvedValue(existingMap);
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await categoriesRepository.importCategories(
        newCategories,
        'merge',
      );

      // Assert
      expect(result.imported).toBe(0);
      expect(result.skipped).toBe(1);
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap['cat-system']).toEqual(mockSystemCategory);
    });

    it('should update timestamps on imported categories', async () => {
      // Arrange
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      (storageService.getItem as jest.Mock).mockResolvedValue({});
      (storageService.setItem as jest.Mock).mockResolvedValue(undefined);

      const newCategories = [mockCategory];

      // Act
      await categoriesRepository.importCategories(newCategories);

      // Assert
      const savedMap = (storageService.setItem as jest.Mock).mock.calls[0][1];
      expect(savedMap[mockCategory.id].updatedAt).toBe(now);
    });
  });
});
