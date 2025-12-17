import { Appearance } from 'react-native';
import { lightColors, darkColors, spacing, radii, typography } from './colors';
import StorageHelper, { StorageKeys } from '../data/mmkv-storage';

const themes: any = { light: lightColors, dark: darkColors };

// MMKV require to avoid type/value only TS issues

type ThemeMode = 'system' | 'light' | 'dark';

type ThemeActive = 'light' | 'dark';

class ThemeServiceClass {
  private mode: ThemeMode = 'system';
  private system: ThemeActive = 'light';
  private listeners: Set<(active: ThemeActive) => void> = new Set();

  constructor() {
    try {
      //   (StorageHelper.getItem(StorageKeys.APP_THEME) as any).then(
      //     (s: any) => (this.mode = s),
      //   );
    } catch (e) {
      // ignore
    }

    const sys = (Appearance.getColorScheme() || 'light') as ThemeActive;
    this.system = sys;

    Appearance.addChangeListener(({ colorScheme }) => {
      this.system = (colorScheme || 'light') as ThemeActive;
      this.emit();
    });
  }

  getMode(): ThemeMode {
    return this.mode;
  }

  getActive(): ThemeActive {
    return this.mode === 'system' ? this.system : (this.mode as ThemeActive);
  }

  getColors() {
    const key = this.getActive();
    return (themes as any)[key];
  }

  getTokens() {
    return {
      colors: this.getColors(),
      spacing,
      radii,
      typography,
    };
  }

  setMode(m: ThemeMode) {
    this.mode = m;
    try {
      StorageHelper.setItem(StorageKeys.APP_THEME, m);
    } catch (e) {
      // ignore
    }
    this.emit();
  }

  onChange(cb: (active: ThemeActive) => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit() {
    const active = this.getActive();
    this.listeners.forEach(cb => cb(active));
  }
}

export const ThemeService = new ThemeServiceClass();

// Colors proxy that reads from ThemeService at access time
export const Colors: any = new Proxy(
  {},
  {
    get(_, prop: string) {
      const c: any = ThemeService.getColors();
      return c ? c[prop] : undefined;
    },
  },
);

export const Spacing = spacing;
export const Radii = radii;
export const Typography = typography;
