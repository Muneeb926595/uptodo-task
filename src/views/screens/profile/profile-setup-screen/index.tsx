import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { styles } from './styles';
import { AppText } from '../../../../views/components/text';
import { AppIcon } from '../../../../views/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../views/components/icon/types';
import { useTheme } from '../../../../theme';
import { profileRepository } from '../../../../repository/profile';
import { mediaService } from '../../../../services/media';
import { navigationRef } from '../../../navigation';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../services/localisation';
import { AuthInput } from '../../../../views/components/auth-input';

interface ProfileSetupScreenProps {
  onComplete?: () => void;
}

type ProfileFormData = {
  name: string;
  email: string;
};

export const ProfileSetupScreen = ({ onComplete }: ProfileSetupScreenProps) => {
  const { theme } = useTheme();
  const [avatar, setAvatar] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const handleChangeAvatar = async () => {
    try {
      const result = await mediaService.pickImage({
        mediaType: 'photo',
        includeBase64: false,
      });

      if (result && result.uri) {
        setAvatar(result.uri);
      }
    } catch (error) {
      console.error('Error picking avatar:', error);
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.failedToSelectImage,
        ),
      );
    }
  };

  const handleContinue = async (data: ProfileFormData) => {
    setIsSubmitting(true);

    try {
      await profileRepository.createProfile({
        name: data.name.trim(),
        email: data.email.trim() || undefined,
        avatar,
      });

      // Navigate to home or call completion callback
      if (onComplete) {
        onComplete();
      } else {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.failedToCreateProfile,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <AppText style={styles.title}>
              <FormattedMessage
                id={LocaleProvider.IDs.label.createYourProfile}
              />
            </AppText>
            <AppText style={styles.subtitle}>
              <FormattedMessage
                id={LocaleProvider.IDs.label.personalizeYourExperience}
              />
            </AppText>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <AppIcon
                  name={AppIconName.user}
                  iconSize={AppIconSize.huge}
                  color={theme.colors.typography['300']}
                  style={styles.avatarPlaceholder}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.changeAvatarButton}
              onPress={handleChangeAvatar}
              activeOpacity={0.7}
            >
              <AppText style={styles.changeAvatarText}>
                {avatar
                  ? LocaleProvider.formatMessage(
                      LocaleProvider.IDs.label.changePhoto,
                    )
                  : LocaleProvider.formatMessage(
                      LocaleProvider.IDs.label.addPhoto,
                    )}
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <View style={styles.inputSection}>
            <AppText style={styles.label}>Name *</AppText>
            <Controller
              control={control}
              name="name"
              rules={{
                required: true,
                minLength: 2,
                maxLength: 50,
                validate: value => value.trim().length >= 2,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.enterYourName,
                  )}
                  returnKeyType="next"
                  isError={errors.name}
                />
              )}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <AppText style={styles.label}>Email (Optional)</AppText>
            <Controller
              control={control}
              name="email"
              rules={{
                maxLength: 100,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthInput
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.enterYourEmail,
                  )}
                  keyboardType="email-address"
                  returnKeyType="done"
                  isError={errors.email}
                />
              )}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isValid || isSubmitting) && styles.continueButtonDisabled,
            ]}
            onPress={handleSubmit(handleContinue)}
            disabled={!isValid || isSubmitting}
            activeOpacity={0.7}
          >
            <AppText style={styles.continueButtonText}>
              {isSubmitting
                ? LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.creatingProfile,
                  )
                : LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.continue,
                  )}
            </AppText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
