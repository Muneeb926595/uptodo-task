import { View, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { styles } from './styles';

type Props = {
  dividerStyles?: StyleProp<ViewStyle>;
};

export const Divider = (props: Props) => {
  const { dividerStyles } = props;
  return <View style={[styles.container, dividerStyles]} />;
};
