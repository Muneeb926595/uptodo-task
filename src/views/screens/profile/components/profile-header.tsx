import React from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import { UserProfile } from '../../../../types';
import { mediaService } from '../../../../services/media';
import { LocaleProvider } from '../../../../services/localisation';
import { AppIcon, AppText } from '../../../components';
import { AppIconName, AppIconSize } from '../../../components/icon/types';

interface ProfileHeaderProps {
  profile: UserProfile | null | undefined;
  theme: any;
  styles: any;
  onAvatarChange: (uri: string) => void;
}

export const ProfileHeader = ({
  profile,
  theme,
  styles,
  onAvatarChange,
}: ProfileHeaderProps) => {
  const handleChangeAvatar = async () => {
    try {
      const result = await mediaService.pickImage({
        mediaType: 'photo',
        includeBase64: false,
      });

      if (result && result.uri) {
        onAvatarChange(result.uri);
      }
    } catch (error) {
      console.error('Error changing avatar:', error);
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.failedToUpdateAvatar,
        ),
      );
    }
  };

  return (
    <View style={[styles.section, styles.profileSection]}>
      <View style={styles.avatarContainer}>
        {profile?.avatar ? (
          <Image
            source={{ uri: profile.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <AppIcon
            name={AppIconName.user}
            iconSize={AppIconSize.huge}
            color={theme.colors.typography[300]}
            style={styles.avatarPlaceholder}
          />
        )}
        <TouchableOpacity
          style={styles.editAvatarButton}
          onPress={handleChangeAvatar}
          activeOpacity={0.7}
        >
          <AppIcon
            name={AppIconName.image}
            iconSize={AppIconSize.small}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
      <AppText style={styles.profileName}>{profile?.name || 'User'}</AppText>
      {profile?.email && (
        <AppText style={styles.profileEmail}>{profile.email}</AppText>
      )}
    </View>
  );
};
