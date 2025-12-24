import { FC, ReactNode } from 'react';
import { StyleProp, TextProps, TextStyle, ViewStyle } from 'react-native';

export type Props = FC<
  TextProps & {
    emphasis?: Emphasis;
  } & {
    maxNumberOfLines?: number;
  }
>;

export type SmallParagraphLinkProps = {
  style?: StyleProp<TextStyle>;
  onPress: Function;
  children?: ReactNode;
};

export type ParagraphLinkProps = {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  onPress: any;
  title: ReactNode | string;
};

export type ParagraphLinkBoldProps = {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  onPress: any;
  title: ReactNode | string;
};

export enum Emphasis {
  low = 'low',
  high = 'high',
  medium = 'medium'
}
