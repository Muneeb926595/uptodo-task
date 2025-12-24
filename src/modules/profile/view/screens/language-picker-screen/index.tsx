import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../../app/theme';
import { AppText } from '../../../../../app/components/text';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { navigationRef } from '../../../../../app/navigation';
import { LocaleProvider } from '../../../../../app/localisation';
import { storageService, StorageKeys } from '../../../../services/storage';
import { styles } from './styles';

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

const LANGUAGES: Language[] = [
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'es-US',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
];

export const LanguagePickerScreen = () => {
  const { theme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en-US');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentLanguage();
  }, []);

  const loadCurrentLanguage = async () => {
    try {
      const savedLanguage = await storageService.getItem(
        StorageKeys.SELECTED_APP_LANGUAGE,
      );
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage as string);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleLanguageSelect = async (languageCode: string) => {
    if (currentLanguage === languageCode || loading) return;

    try {
      setLoading(true);

      // Change language
      await LocaleProvider.changeLanguage(languageCode);

      // Save preference
      await storageService.setItem(
        StorageKeys.SELECTED_APP_LANGUAGE,
        languageCode,
      );

      setCurrentLanguage(languageCode);

      // Show success and go back
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.success),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.languageChangeRestart,
        ),
        [
          {
            text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok),
            onPress: () => {
              // Reset navigation to force re-render with new language
              navigationRef.reset({
                index: 0,
                routes: [{ name: 'Tabs' }],
              });
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.failedToChangeLanguage,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigationRef.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AppIcon
            name={AppIconName.leftArrow}
            iconSize={AppIconSize.medium}
            color={styles.headerTitle.color}
          />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>
          {LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.chooseLanguage,
          )}
        </AppText>
        <View style={styles.placeholder} />
      </View>

      {/* Language List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {LANGUAGES.map(language => {
          const isSelected = currentLanguage === language.code;

          return (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                isSelected && styles.languageCardSelected,
              ]}
              onPress={() => handleLanguageSelect(language.code)}
              activeOpacity={0.7}
              disabled={loading}
            >
              {/* Language Info */}
              <View style={styles.languageInfo}>
                <View style={styles.languageHeader}>
                  <AppText style={styles.languageFlag}>{language.flag}</AppText>
                  <View style={styles.languageTextContainer}>
                    <AppText style={styles.languageName}>
                      {language.name}
                    </AppText>
                    <AppText style={styles.languageNativeName}>
                      {language.nativeName}
                    </AppText>
                  </View>
                </View>
              </View>

              {/* Selection Indicator */}
              {isSelected && (
                <View style={styles.checkIconContainer}>
                  <AppIcon
                    name={AppIconName.send}
                    iconSize={AppIconSize.medium}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};
