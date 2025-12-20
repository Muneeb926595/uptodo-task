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
import { AppText } from '../../../../../app/components/text';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { useTheme } from '../../../../../app/theme';
import { profileRepository } from '../../../repository/profile-repository';
import { mediaService } from '../../../../services/media';
import { navigationRef } from '../../../../../app/navigation';

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
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleContinue = async () => {
    if (!isNameValid) {
      Alert.alert(
        'Invalid Name',
        'Please enter a valid name (at least 2 characters)',
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
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Create profile with default name
    handleContinue();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <AppText style={styles.title}>Create Your Profile</AppText>
            <AppText style={styles.subtitle}>
              Let's personalize your UpTodo experience
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
                {avatar ? 'Change Photo' : 'Add Photo'}
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
              placeholder="Enter your name"
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
              placeholder="Enter your email"
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
              {isSubmitting ? 'Creating Profile...' : 'Continue'}
            </AppText>
          </TouchableOpacity>

          {/* Skip Button */}
          {!name && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <AppText style={styles.skipButtonText}>Skip for now</AppText>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
