import { StyleProp, ViewStyle } from 'react-native';

export type Edge = 'top' | 'right' | 'bottom' | 'left';
export type KeyboardBehaviour = 'height' | 'padding' | 'position';

export type Props = {
  hasScroll?: any;
  bounces?: any;
  onScroll?: any;
  insetsToHandle?: Array<Edge>;
  options?: any;
  keyboardBehaviour?: KeyboardBehaviour;
  screenBackgroundStyle?: StyleProp<ViewStyle>;
  scrollEventThrottle?: any;
  persistTaps?: any;
  containerStyles?: StyleProp<ViewStyle>;
  scrollViewContentContainerStyles?: StyleProp<ViewStyle>;
  [x: string]: any;
};
