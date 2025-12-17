import { FieldError } from 'react-hook-form';
import { StyleProp, ViewStyle } from 'react-native';

export type Country = {
  name: string;
  flag: string;
  countryCode: string;
  dialCode: string;
};

export type Props = {
  countryItem: Country;
  value?: string;
  isError?: boolean | FieldError;
  placeholder?: string;
  onTextChanged: (text: string) => void;
  onCountryCodePress: () => void;
  containerStyles?: StyleProp<ViewStyle>;
};
