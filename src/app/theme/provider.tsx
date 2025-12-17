import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode } from './index';
import { ThemeService } from './service';

type ActiveTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: any;
  active: ActiveTheme;
}

const ThemeContext = createContext<ThemeContextValue>(null as any);

export const ThemeProvider = ({ children }: any) => {
  // Use ThemeService as single source of truth for theme state
  const system = (useColorScheme() as ActiveTheme) || 'light';
  const [active, setActive] = useState<ActiveTheme>(ThemeService.getActive());
  const [mode, setModeState] = useState<ThemeMode>(ThemeService.getMode());

  useEffect(() => {
    const unsub = ThemeService.onChange((a: ActiveTheme) => {
      setActive(a);
      setModeState(ThemeService.getMode());
    });
    return () => {
      unsub();
    };
  }, []);

  const colors = useMemo(() => ThemeService.getColors(), [active]);

  const setMode = (m: ThemeMode) => {
    ThemeService.setMode(m);
    setModeState(m);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors, active }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
