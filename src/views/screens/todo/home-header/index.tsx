import { View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { AppText } from '../../../../views/components/text';
import { Constants, Images, Layout } from '../../../../globals';
import { CustomImage } from '../../../../views/components/custom-image';
import { AppIcon } from '../../../../views/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../views/components/icon/types';
import { useTheme } from '../../../../theme';
import { navigationRef } from '../../../navigation';
import { profileRepository } from '../../../../repository/profile';
import { UserProfile } from '../../../../types/profile.types';
import { Conditional } from '../../../../views/components/conditional';

type HomeHeaderProps = {
  title: string;
  onFilterPress?: () => void;
};

export const HomeHeader = ({ title, onFilterPress }: HomeHeaderProps) => {
  const { theme } = useTheme();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await profileRepository.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.transparent }]}
      edges={['top']}
    >
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
          style={{ flex: 0.2 }}
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
