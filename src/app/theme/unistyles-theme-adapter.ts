/**
 * Unistyles Theme Adapter Implementation
 * Concrete implementation using react-native-unistyles library
 */

import { UnistylesRuntime } from 'react-native-unistyles';
import { ThemeAdapter, ThemeName, ThemeMetadata } from './theme-adapter';
import {
  purpleDream,
  oceanBlue,
  forestGreen,
  sunsetOrange,
  rosePink,
} from './themes';

const themeMetadata: Record<ThemeName, ThemeMetadata> = {
  purpleDream: {
    name: 'Purple Dream',
    description: 'Elegant purple with lavender accents',
    icon: '💜',
  },
  oceanBlue: {
    name: 'Ocean Blue',
    description: 'Deep ocean blue with aqua tones',
    icon: '🌊',
  },
  forestGreen: {
    name: 'Forest Green',
    description: 'Nature-inspired green theme',
    icon: '🌲',
  },
  sunsetOrange: {
    name: 'Sunset Orange',
    description: 'Warm orange with vibrant hues',
    icon: '🌅',
  },
  rosePink: {
    name: 'Rose Pink',
    description: 'Romantic pink with soft tones',
    icon: '🌸',
  },
};

const themeMap = {
  purpleDream,
  oceanBlue,
  forestGreen,
  sunsetOrange,
  rosePink,
};

export class UnistylesThemeAdapter implements ThemeAdapter {
  getCurrentTheme(): any {
    const themeName = this.getCurrentThemeName();
    return themeMap[themeName];
  }

  getCurrentThemeName(): ThemeName {
    return UnistylesRuntime.themeName as ThemeName;
  }

  setTheme(name: ThemeName): void {
    UnistylesRuntime.setTheme(name);
  }

  getThemeMetadata(name: ThemeName): ThemeMetadata {
    return themeMetadata[name];
  }

  getAllThemeMetadata(): Record<ThemeName, ThemeMetadata> {
    return themeMetadata;
  }

  onThemeChange(callback: (theme: any) => void): () => void {
    // Unistyles doesn't have a direct listener API, but theme changes
    // trigger re-renders automatically, so we can return a no-op
    // In a real implementation, you might need to use a custom event system
    return () => {};
  }

  getAvailableThemes(): ThemeName[] {
    return [
      'purpleDream',
      'oceanBlue',
      'forestGreen',
      'sunsetOrange',
      'rosePink',
    ];
  }
}
