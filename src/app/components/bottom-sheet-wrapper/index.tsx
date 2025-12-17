import { View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { AppIcon } from '../icon';
import { AppIconName } from '../icon/types';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { magicSheet } from 'react-native-magic-sheet';
import { AppText } from '../text';
import { Colors } from '../../theme';

type Props = {
  children: any;
  headerTitle: string;
  iconName?: AppIconName;
};

export const BottomSheetWrapper = ({
  children,
  headerTitle,
  iconName,
}: Props) => {
  const handleCloseBottomSheet = () => {
    magicSheet.hide();
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={handleCloseBottomSheet}>
          <AppIcon
            name={iconName ?? AppIconName.leftArrow}
            color={Colors.white}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <AppText style={styles.heading}>{headerTitle}</AppText>
      </View>

      {children}
    </View>
  );
};
