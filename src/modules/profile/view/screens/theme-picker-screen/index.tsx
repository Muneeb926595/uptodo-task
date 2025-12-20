import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useTheme,
  themeMetadata,
  type ThemeName,
  createStyles,
  setTheme,
  UnistylesRuntime,
} from '../../../../../app/theme';
import { AppText } from '../../../../../app/components/text';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Layout } from '../../../../../app/globals';
import { navigationRef } from '../../../../../app/navigation';

export const ThemePickerScreen = () => {
  const currentTheme = UnistylesRuntime.themeName as ThemeName;
  const { theme } = useTheme();

  const handleThemeSelect = (themeName: ThemeName) => {
    setTheme(themeName);
  };

  const handleBack = () => {
    navigationRef.goBack();
  };

  const themes: ThemeName[] = [
    'purpleDream',
    'oceanBlue',
    'forestGreen',
    'sunsetOrange',
    'rosePink',
  ];

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
        <AppText style={styles.headerTitle}>Choose Theme</AppText>
        <View style={styles.placeholder} />
      </View>

      {/* Theme List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {themes.map(themeName => {
          const meta = themeMetadata[themeName];
          const isSelected = currentTheme === themeName;

          return (
            <TouchableOpacity
              key={themeName}
              style={[styles.themeCard, isSelected && styles.themeCardSelected]}
              onPress={() => handleThemeSelect(themeName)}
              activeOpacity={0.7}
            >
              {/* Theme Info */}
              <View style={styles.themeInfo}>
                <View style={styles.themeHeader}>
                  <AppText style={styles.themeIcon}>{meta.icon}</AppText>
                  <AppText style={styles.themeName}>{meta.name}</AppText>
                </View>
                <AppText style={styles.themeDescription}>
                  {meta.description}
                </AppText>
              </View>

              {/* Selected Indicator */}
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <AppText style={styles.checkmark}>✓</AppText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = createStyles.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Layout.widthPercentageToDP(4),
    paddingVertical: Layout.heightPercentageToDP(2),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borders['50'],
  },
  backButton: {
    padding: Layout.widthPercentageToDP(2),
  },
  headerTitle: {
    fontSize: Layout.RFValue(20),
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
  placeholder: {
    width: Layout.widthPercentageToDP(10),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.widthPercentageToDP(4),
  },
  themeCard: {
    backgroundColor: theme.colors.surface.DEFAULT,
    borderRadius: 16,
    padding: Layout.widthPercentageToDP(4),
    marginBottom: Layout.heightPercentageToDP(2),
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  themeCardSelected: {
    borderColor: theme.colors.brand.DEFAULT,
    backgroundColor: theme.colors.surface['50'],
  },
  themeInfo: {
    flex: 1,
  },
  themeHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Layout.heightPercentageToDP(0.5),
  },
  themeIcon: {
    fontSize: Layout.RFValue(24),
    marginRight: Layout.widthPercentageToDP(2),
  },
  themeName: {
    fontSize: Layout.RFValue(18),
    fontWeight: '600' as const,
    color: theme.colors.white,
  },
  themeDescription: {
    fontSize: Layout.RFValue(14),
    color: theme.colors.typography['300'],
  },
  selectedBadge: {
    backgroundColor: theme.colors.brand.DEFAULT,
    borderRadius: 20,
    width: Layout.widthPercentageToDP(8),
    height: Layout.widthPercentageToDP(8),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: Layout.RFValue(16),
    fontWeight: 'bold' as const,
  },
  bottomSpacer: {
    height: Layout.heightPercentageToDP(4),
  },
}));
