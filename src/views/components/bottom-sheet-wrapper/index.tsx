import { View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { AppIconName } from '../icon/types';
import { AppText } from '../text';

type Props = {
  children: any;
  headerTitle: string;
  iconName?: AppIconName;
};

export const BottomSheetWrapper = ({ children, headerTitle }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <AppText style={styles.heading}>{headerTitle}</AppText>
      </View>

      {children}
    </View>
  );
};
