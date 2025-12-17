import { StyleSheet } from 'react-native';
import { Layout } from '../../globals';
import { Colors } from '../../theme';

export const iconOptions: any = {
  smallCircle: { ...Layout.icon.smallCircle },
  mediumCircle: { ...Layout.icon.mediumCircle },
  bigCircle: { ...Layout.icon.xxlargeCircle },
  miniIcon: Layout.icon.size.mini,
  smallIcon: Layout.icon.size.xlarge,
  mediumIcon: Layout.icon.size.small,
  bigIcon: Layout.icon.size.xxlarge,

  default: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  primary: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  secondary: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  info: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  instruction: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  action: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  success: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  error: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  warning: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  pending: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
  disabled: {
    color: Colors.brand[500],
    backgroundColor: Colors.brand[100],
  },
};

export const styles = StyleSheet.create({
  microCircle: { ...Layout.icon.microCircle },
  miniCircle: { ...Layout.icon.miniCircle },
  smallCircle: {
    ...Layout.icon.smallCircle,
    backgroundColor: Colors.brand[500],
  },
  mediumCircle: { ...Layout.icon.mediumCircle },
  largeCircle: { ...Layout.icon.largeCircle },
  xlargeCircle: { ...Layout.icon.xlargeCircle },
  xxlargeCircle: { ...Layout.icon.xxlargeCircle },
  bigCircle: { ...Layout.icon.xxlargeCircle },
  hugeCircle: { ...Layout.icon.hugeCircle },
  iconPosition: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
