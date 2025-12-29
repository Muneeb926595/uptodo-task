import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { useTheme } from '../../../../../theme';
import { Constants, Images, Layout } from '../../../../../globals';
import {
  AppIcon,
  AppText,
  Conditional,
  CustomImage,
} from '../../../../components';
import { AppIconName, AppIconSize } from '../../../../components/icon/types';
import { useProfile } from '../../../../../react-query/profile';
import { navigationRef } from '../../../../../navigation';

type HomeHeaderProps = {
  title: string;
  onFilterPress?: () => void;
};

export const HomeHeader = ({ title, onFilterPress }: HomeHeaderProps) => {
  const { theme } = useTheme();
  const { data: profile } = useProfile();

  const handleFilterPress = () => {
    if (onFilterPress) {
      onFilterPress();
    } else {
      navigationRef.navigate('CreateNewCategoryScreen');
    }
  };
  const handlePressProfile = () => {
    // @ts-ignore
    navigationRef.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
          onPress={handleFilterPress}
        >
          <AppIcon
            name={AppIconName.filter}
            color={theme.colors.white}
            iconSize={AppIconSize.xxlarge}
          />
        </TouchableOpacity>

        <AppText style={styles.title}>{title}</AppText>

        <TouchableOpacity
          hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
          onPress={handlePressProfile}
          style={styles.profileContainer}
        >
          <Conditional
            ifTrue={profile?.avatar}
            elseChildren={
              <AppIcon
                name={AppIconName.user}
                iconSize={AppIconSize.primary}
                color={theme.colors.white}
              />
            }
          >
            <CustomImage
              uri={profile?.avatar}
              imageStyles={styles.headerImage}
              placeHolder={Images.Avatar}
              resizeMode="cover"
              svgDimensions={{
                width: Layout.widthPercentageToDP(8),
                height: Layout.widthPercentageToDP(8),
              }}
            />
          </Conditional>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
