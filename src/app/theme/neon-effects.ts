import { ViewStyle, TextStyle } from 'react-native';
import { Colors } from '.';

export const createNeonEffect = (
  color: string,
  intensity: 'low' | 'medium' | 'high' = 'medium',
) => {
  const shadowIntensity = {
    low: { radius: 8, opacity: 0.5 },
    medium: { radius: 15, opacity: 0.7 },
    high: { radius: 25, opacity: 0.9 },
  }[intensity];

  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: shadowIntensity?.opacity,
    shadowRadius: shadowIntensity?.radius,
    elevation: shadowIntensity?.radius,
  };
};

export const NeonEffects = {
  // Button neon effects
  buttonPrimary: (color: string = Colors.brand['DEFAULT']) =>
    ({
      ...createNeonEffect(color, 'medium'),
      borderWidth: 1,
      borderColor: color,
    } as ViewStyle),

  buttonHigh: (color: string = Colors.brand['DEFAULT']) =>
    ({
      ...createNeonEffect(color, 'high'),
      borderWidth: 2,
      borderColor: color,
    } as ViewStyle),

  buttonLow: (color: string = Colors.brand['DEFAULT']) =>
    ({
      ...createNeonEffect(color, 'low'),
      borderWidth: 1,
      borderColor: color,
    } as ViewStyle),

  // Text neon effects
  textGlow: (color: string = Colors.brand['DEFAULT']) =>
    ({
      textShadowColor: color,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    } as TextStyle),

  textGlowStrong: (color: string = Colors.brand['DEFAULT']) =>
    ({
      textShadowColor: color,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 20,
    } as TextStyle),

  // Icon/Image neon effects
  iconGlow: (color: string = Colors.brand['DEFAULT']) =>
    ({
      ...createNeonEffect(color, 'medium'),
    } as ViewStyle),

  // Pulsing animation effect (use with Animated.View)
  getPulseAnimation: (color: string = Colors.brand['DEFAULT']) =>
    ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 20,
      borderWidth: 1,
      borderColor: color,
    } as ViewStyle),
};

// Preset neon colors
export const NeonColors = {
  blue: '#00D9FF',
  purple: '#B026FF',
  pink: '#FF10F0',
  green: '#39FF14',
  orange: '#FF6600',
  red: '#FF073A',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
};
