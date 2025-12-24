import RNFS from 'react-native-fs';
import { Platform, Share, Alert } from 'react-native';
import { Todo } from '../../todo/types/todo.types';
import { Category } from '../../categories/types/categories.types';

export interface ExportData {
  version: string;
  exportDate: number;
  todos: Todo[];
  categories?: Category[];
}

class ImportExportService {
  private readonly CURRENT_VERSION = '1.0';

  /**
   * Export todos and categories to JSON file
   */
  async exportTodos(todos: Todo[], categories: Category[] = []): Promise<void> {
    try {
      const exportData: ExportData = {
        version: this.CURRENT_VERSION,
        exportDate: Date.now(),
        todos: todos.map(todo => ({
          ...todo,
          // Remove derived/populated fields
          category: undefined,
          isOverdue: undefined,
        })),
        categories,
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const fileName = `uptodo-backup-${
        new Date().toISOString().split('T')[0]
      }.json`;

      if (Platform.OS === 'ios') {
        // iOS: Use Share API
        const path = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
        await RNFS.writeFile(path, jsonContent, 'utf8');

        await Share.share({
          url: `file://${path}`,
          message: 'UpTodo Backup',
          title: 'Export Todos',
        });

        // Clean up temporary file after a delay
        setTimeout(async () => {
          try {
            await RNFS.unlink(path);
          } catch (e) {
            // Ignore cleanup errors
          }
        }, 5000);
      } else {
        // Android: Save to Downloads
        const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
        await RNFS.writeFile(path, jsonContent, 'utf8');

        Alert.alert(
          'Export Successful',
          `Your todos have been exported to:\n${path}`,
          [
            {
              text: 'Share',
              onPress: async () => {
                try {
                  await Share.share({
                    url: `file://${path}`,
                    message: 'UpTodo Backup',
                    title: 'Export Todos',
                  });
                } catch (e) {
                  // User cancelled share
                }
              },
            },
            { text: 'OK' },
          ],
        );
      }
    } catch (error) {
      console.error('Export error:', error);
      throw new Error('Failed to export todos. Please try again.');
    }
  }

  /**
   * Import todos from JSON file
   */
  async importTodos(fileUri: string): Promise<ExportData> {
    try {
      // Read file content
      const content = await RNFS.readFile(fileUri, 'utf8');
      const data: ExportData = JSON.parse(content);

      // Validate data structure
      if (!data.version || !Array.isArray(data.todos)) {
        throw new Error('Invalid backup file format');
      }

      // Version compatibility check
      if (data.version !== this.CURRENT_VERSION) {
        console.warn(
          `Backup version ${data.version} differs from current ${this.CURRENT_VERSION}`,
        );
      }

      return data;
    } catch (error) {
      console.error('Import error:', error);
      if (error instanceof SyntaxError) {
        throw new Error(
          'Invalid JSON file. Please select a valid backup file.',
        );
      }
      throw new Error('Failed to import todos. Please try again.');
    }
  }

  /**
   * Get readable export summary
   */
  getExportSummary(data: ExportData): string {
    const date = new Date(data.exportDate).toLocaleDateString();
    const todoCount = data.todos.length;
    const categoryCount = data.categories?.length || 0;

    return `Backup from ${date}\n${todoCount} todos${
      categoryCount > 0 ? `, ${categoryCount} categories` : ''
    }`;
  }

  /**
   * Validate import data before merging
   */
  validateImportData(data: ExportData): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.todos || data.todos.length === 0) {
      errors.push('No todos found in backup file');
    }

    // Validate todo structure
    data.todos.forEach((todo, index) => {
      if (!todo.id) {
        errors.push(`Todo at index ${index} is missing an ID`);
      }
      if (!todo.title) {
        errors.push(`Todo at index ${index} is missing a title`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const importExportService = new ImportExportService();
