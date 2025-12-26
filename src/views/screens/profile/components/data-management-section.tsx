import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from '@react-native-documents/picker';
import { useQueryClient } from '@tanstack/react-query';
import { Category, Todo } from '../../../../types';
import { categoriesRepository, todoRepository } from '../../../../repository';
import { LocaleProvider } from '../../../../services/localisation';
import { importExportService } from '../../../../services/import-export';
import { categoriesKeys, todosKeys } from '../../../../react-query';
import { AppIcon, AppText } from '../../../components';
import { AppIconName, AppIconSize } from '../../../components/icon/types';

interface DataManagementSectionProps {
  theme: any;
  styles: any;
}

interface ImportData {
  todos: Todo[];
  categories?: Category[];
}

export const DataManagementSection = ({
  theme,
  styles,
}: DataManagementSectionProps) => {
  const queryClient = useQueryClient();
  const [exportingData, setExportingData] = useState(false);
  const [importingData, setImportingData] = useState(false);

  const handleExportTodos = async () => {
    try {
      setExportingData(true);
      const todos = await todoRepository.getAll();
      const categories = await categoriesRepository.getAll();

      if (todos.length === 0) {
        Alert.alert(
          LocaleProvider.formatMessage(LocaleProvider.IDs.message.noTodos),
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.noTodosToExport,
          ),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
        );
        return;
      }

      await importExportService.exportTodos(todos, categories);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : LocaleProvider.formatMessage(
              LocaleProvider.IDs.message.failedToExportTodos,
            );

      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.exportFailed),
        errorMessage,
      );
    } finally {
      setExportingData(false);
    }
  };

  const performImport = async (
    data: ImportData,
    strategy: 'merge' | 'replace',
  ) => {
    try {
      setImportingData(true);

      // Import categories first (if any)
      let categoriesResult = { imported: 0, skipped: 0 };
      if (data.categories && data.categories.length > 0) {
        categoriesResult = await categoriesRepository.importCategories(
          data.categories,
          strategy,
        );
      }

      // Import todos
      const todosResult = await todoRepository.importTodos(
        data.todos,
        strategy,
      );

      const totalSkipped = todosResult.skipped + categoriesResult.skipped;

      let message = LocaleProvider.formatMessage(
        LocaleProvider.IDs.message.successfullyImported,
        { count: todosResult.imported },
      );
      if (categoriesResult.imported > 0) {
        message += LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.andCategories,
          { count: categoriesResult.imported },
        );
      }
      if (totalSkipped > 0) {
        message += `\n${LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.itemsSkipped,
          { count: totalSkipped },
        )}`;
      }
      if (todosResult.errors > 0) {
        message += `\n${LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.errorsOccurred,
          { count: todosResult.errors },
        )}`;
      }

      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: todosKeys.all() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all() });

      Alert.alert(
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.importSuccessful,
        ),
        message,
        [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : LocaleProvider.formatMessage(
              LocaleProvider.IDs.message.failedToImportTodos,
            );

      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.importFailed),
        errorMessage,
      );
    } finally {
      setImportingData(false);
    }
  };

  const confirmReplaceImport = (data: ImportData) => {
    Alert.alert(
      LocaleProvider.formatMessage(LocaleProvider.IDs.message.replaceAllTodos),
      LocaleProvider.formatMessage(
        LocaleProvider.IDs.message.replaceAllTodosWarning,
      ),
      [
        {
          text: LocaleProvider.formatMessage(LocaleProvider.IDs.general.cancel),
          style: 'cancel',
        },
        {
          text: LocaleProvider.formatMessage(
            LocaleProvider.IDs.label.replaceAll,
          ),
          style: 'destructive',
          onPress: () => performImport(data, 'replace'),
        },
      ],
    );
  };

  const handleImportTodos = async () => {
    try {
      // Pick a file
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });

      if (!result || result.length === 0) {
        return;
      }

      const file = result[0];
      const filePath = file.uri;

      setImportingData(true);

      // Import and validate
      const data = await importExportService.importTodos(filePath);
      const validation = importExportService.validateImportData(data);

      if (!validation.valid) {
        Alert.alert(
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.invalidBackupFile,
          ),
          validation.errors.join('\n'),
          [{ text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok) }],
        );
        return;
      }

      const summary = importExportService.getExportSummary(data);

      // Ask user for import strategy
      Alert.alert(
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.importTodosTitle,
        ),
        `${summary}\n\n${LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.howToImport,
        )}`,
        [
          {
            text: LocaleProvider.formatMessage(
              LocaleProvider.IDs.general.cancel,
            ),
            style: 'cancel',
          },
          {
            text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.merge),
            onPress: () => performImport(data, 'merge'),
          },
          {
            text: LocaleProvider.formatMessage(
              LocaleProvider.IDs.label.replaceAll,
            ),
            onPress: () => confirmReplaceImport(data),
            style: 'destructive',
          },
        ],
      );
    } catch (error) {
      // Check if user cancelled
      const isUserCancelled =
        error &&
        typeof error === 'object' &&
        ('code' in error
          ? error.code === 'DOCUMENT_PICKER_CANCELED'
          : 'message' in error &&
            typeof error.message === 'string' &&
            error.message.includes('cancel'));

      if (isUserCancelled) {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : LocaleProvider.formatMessage(
              LocaleProvider.IDs.message.failedToImportTodos,
            );

      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.importFailed),
        errorMessage,
      );
    } finally {
      setImportingData(false);
    }
  };

  return (
    <View style={styles.section}>
      <AppText style={styles.sectionHeader}>
        {LocaleProvider.formatMessage(LocaleProvider.IDs.label.dataManagement)}
      </AppText>

      <TouchableOpacity
        style={styles.settingItem}
        onPress={handleExportTodos}
        activeOpacity={0.7}
        disabled={exportingData}
      >
        <View style={styles.settingItemLeft}>
          <AppIcon
            name={AppIconName.send}
            iconSize={AppIconSize.medium}
            color={theme.colors.brand.DEFAULT}
            style={styles.settingIcon}
          />
          <View style={styles.settingTextContainer}>
            <AppText style={styles.settingTitle}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.exportTodos,
              )}
            </AppText>
            <AppText style={styles.settingSubtitle}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.backupYourTodosToFile,
              )}
            </AppText>
          </View>
        </View>
        {exportingData ? (
          <ActivityIndicator color={theme.colors.brand.DEFAULT} />
        ) : (
          <AppIcon
            name={AppIconName.rightArrow}
            iconSize={AppIconSize.small}
            color={theme.colors.typography[300]}
            style={styles.settingChevron}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingItem}
        onPress={handleImportTodos}
        activeOpacity={0.7}
        disabled={importingData}
      >
        <View style={styles.settingItemLeft}>
          <AppIcon
            name={AppIconName.repeat}
            iconSize={AppIconSize.medium}
            color={theme.colors.brand.DEFAULT}
            style={styles.settingIcon}
          />
          <View style={styles.settingTextContainer}>
            <AppText style={styles.settingTitle}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.importTodos,
              )}
            </AppText>
            <AppText style={styles.settingSubtitle}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.restoreTodosFromBackup,
              )}
            </AppText>
          </View>
        </View>
        {importingData ? (
          <ActivityIndicator color={theme.colors.brand.DEFAULT} />
        ) : (
          <AppIcon
            name={AppIconName.rightArrow}
            iconSize={AppIconSize.small}
            color={theme.colors.typography[300]}
            style={styles.settingChevron}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
