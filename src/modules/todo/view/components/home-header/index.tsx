import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from './styles';
import { AppText } from '../../../../../app/components/text';
import { Images, Layout } from '../../../../../app/globals';
import { CustomImage } from '../../../../../app/components/custom-image';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';

type HomeHeaderProps = {
  title: string;
};

export const HomeHeader = ({ title }: HomeHeaderProps) => {
  const styles = useStyles();

  const handleFilterPress = () => {};
  const handlePressProfile = () => {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={handleFilterPress}>
          <AppIcon
            name={AppIconName.filter}
            color={Colors.white}
            iconSize={AppIconSize.xxlarge}
          />
        </TouchableOpacity>

        <AppText style={styles.title}>{title}</AppText>

        <TouchableOpacity onPress={handlePressProfile} style={{ flex: 0.2 }}>
          <CustomImage
            uri={undefined}
            imageStyles={styles.headerImage}
            placeHolder={Images.Avatar}
            resizeMode="cover"
            svgDimensions={{
              width: Layout.widthPercentageToDP(8),
              height: Layout.widthPercentageToDP(8),
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
