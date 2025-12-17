import { StyleProp, ViewStyle } from 'react-native';

export type OtpError = string | null;

export type Props = {
  onCodeChanged: (text: string) => void;
  defaultValue?: string;
  secureInput?: boolean;
  cellSpacing?: number;
  rowContainerStyles?: StyleProp<ViewStyle>;
  error?: OtpError;
  cellsLength: number;
};
