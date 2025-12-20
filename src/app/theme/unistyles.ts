/**
 * Unistyles v3 Configuration
 * Configures react-native-unistyles with all themes
 */

import { StyleSheet } from 'react-native-unistyles';
import { purpleDream, oceanBlue, forestGreen, sunsetOrange, rosePink } from './themes';

// Configure Unistyles with all themes
StyleSheet.configure({
  themes: {
    purpleDream,
    oceanBlue,
    forestGreen,
    sunsetOrange,
    rosePink,
  },
  settings: {
    adaptiveThemes: false,
    initialTheme: 'purpleDream',
  },
});

// Type declarations for Unistyles
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    purpleDream: typeof purpleDream;
    oceanBlue: typeof oceanBlue;
    forestGreen: typeof forestGreen;
    sunsetOrange: typeof sunsetOrange;
    rosePink: typeof rosePink;
  }
}

