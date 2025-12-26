import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { navigationRef } from '../../../../navigation';
import { Constants } from '../../../../../globals';
import { AppIcon, AppText } from '../../../../components';
import { AppIconName, AppIconSize } from '../../../../components/icon/types';
import { Colors } from '../../../../../theme';

type EditTodoHeaderProps = {
  title: string;
};

export const EditTodoHeader = ({ title }: EditTodoHeaderProps) => {
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
