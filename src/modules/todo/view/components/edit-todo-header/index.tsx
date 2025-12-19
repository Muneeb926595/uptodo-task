import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from './styles';
import { AppText } from '../../../../../app/components/text';
import { Constants, Images, Layout } from '../../../../../app/globals';
import { CustomImage } from '../../../../../app/components/custom-image';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { navigationRef } from '../../../../../app/navigation';

type EditTodoHeaderProps = {
  title: string;
};

export const EditTodoHeader = ({ title }: EditTodoHeaderProps) => {
  const styles = useStyles();

  const handleFilterPress = () => {
    navigationRef.goBack();
  };
  const handlePressProfile = () => {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
          onPress={handleFilterPress}
          style={styles.iconContainer}
        >
          <AppIcon
            name={AppIconName.cross}
            color={Colors.white}
            iconSize={AppIconSize.primary}
          />
        </TouchableOpacity>

        <AppText style={styles.title}>{title}</AppText>

        <TouchableOpacity
          hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
          onPress={handlePressProfile}
          style={styles.iconContainer}
        >
          <AppIcon
            name={AppIconName.repeat}
            color={Colors.white}
            iconSize={AppIconSize.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
