import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useTheme,
  themeMetadata,
  type ThemeName,
  UnistylesRuntime,
  themeService,
} from '../../../../theme';
import { AppText } from '../../../../views/components/text';
import { AppIcon } from '../../../../views/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../views/components/icon/types';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../services/localisation';
import { styles } from './styles';
import { navigationRef } from '../../../../navigation';

export const ThemePickerScreen = () => {
  const currentTheme = UnistylesRuntime.themeName as ThemeName;
  const { theme } = useTheme();

  const handleThemeSelect = (themeName: ThemeName, event: any) => {
    if (currentTheme === themeName) return;

    // Get the touch coordinates for circular animation
    event.currentTarget.measure(
      (
        _x: number,
        _y: number,
        width: number,
        height: number,
        px: number,
        py: number,
      ) => {
        themeService.setTheme(themeName, {
          animationType: 'circular',
          duration: 900,
          startingPoint: {
            cx: px + width / 2,
            cy: py + height / 2,
          },
        });
      },
    );
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
        <AppText style={styles.headerTitle}>
          <FormattedMessage id={LocaleProvider.IDs.label.chooseTheme} />
        </AppText>
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
              onPress={e => handleThemeSelect(themeName, e)}
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
