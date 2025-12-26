import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

interface ProfileSetupScreenProps {
  onComplete?: () => void;
}

export const ProfileSetupScreen = ({ onComplete }: ProfileSetupScreenProps) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>();
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNameValid = name.trim().length >= 2;

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

  const handleContinue = async () => {
    if (!isNameValid) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.message.invalidName),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.pleaseEnterValidName,
        ),
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await profileRepository.createProfile({
        name: name.trim(),
        email: email.trim() || undefined,
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
            <TextInput
              style={[styles.input, nameFocused && styles.inputFocused]}
              value={name}
              onChangeText={setName}
              placeholder={LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.enterYourName,
              )}
              placeholderTextColor={theme.colors.typography['400']}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              autoCapitalize="words"
              returnKeyType="next"
              maxLength={50}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <AppText style={styles.label}>Email (Optional)</AppText>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              placeholder={LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.enterYourEmail,
              )}
              placeholderTextColor={theme.colors.typography['400']}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              maxLength={100}
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isNameValid || isSubmitting) && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isNameValid || isSubmitting}
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
