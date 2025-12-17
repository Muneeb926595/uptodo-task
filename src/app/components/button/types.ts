import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type Props = {
  onPress: () => void;
  buttonLable: string;
  buttonContainer?: StyleProp<ViewStyle>;
  btnLabelStyles?: StyleProp<TextStyle>;
  loading?: boolean;
  rightIcon?: React.ReactElement;
  leftIcon?: React.ReactElement;
  disabled?: boolean;
  loaderColor?: string;
  authenticationRequired?: boolean;
  disableBgColor?: string;
};
