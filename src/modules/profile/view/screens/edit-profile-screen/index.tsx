import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { styles } from '../profile-setup-screen/styles';
import { AppText } from '../../../../../app/components/text';
import { useTheme } from '../../../../../app/theme';
import { profileRepository } from '../../../repository/profile-repository';
import { navigationRef } from '../../../../../app/navigation';
import { UserProfile } from '../../../types/profile.types';
import { Container } from '../../../../../app/components/container';
import { LocaleProvider } from '../../../../../app/localisation';

export const EditProfileScreen = () => {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await profileRepository.getProfile();
    if (userProfile) {
      setProfile(userProfile);
      setName(userProfile.name);
      setEmail(userProfile.email || '');
    }
  };

  const isNameValid = name.trim().length >= 2;
  const hasChanges =
    name.trim() !== profile?.name || email.trim() !== (profile?.email || '');

  const handleSave = async () => {
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
      await profileRepository.updateProfile({
        name: name.trim(),
        email: email.trim() || undefined,
      });

      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.success),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.profileUpdatedSuccessfully,
        ),
        [
          {
            text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.ok),
            onPress: () => navigationRef.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.failedToUpdateProfile,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      insetsToHandle={['top']}
      screenBackgroundStyle={{ flex: 1 }}
      containerStyles={{ flex: 1 }}
    >
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
            <AppText style={styles.title}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.editProfile,
              )}
            </AppText>
            <AppText style={styles.subtitle}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.updateYourPersonalInformation,
              )}
            </AppText>
          </View>

          {/* Name Input */}
          <View style={styles.inputSection}>
            <AppText style={styles.label}>
              {LocaleProvider.formatMessage(LocaleProvider.IDs.label.name)} *
            </AppText>
            <TextInput
              style={[styles.input, nameFocused && styles.inputFocused]}
              value={name}
              onChangeText={setName}
              placeholder={LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.enterYourNamePlaceholder,
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
            <AppText style={styles.label}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.emailOptional,
              )}
            </AppText>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              placeholder={LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.enterYourEmailPlaceholder,
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

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isNameValid || !hasChanges || isSubmitting) &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!isNameValid || !hasChanges || isSubmitting}
            activeOpacity={0.7}
          >
            <AppText style={styles.continueButtonText}>
              {isSubmitting
                ? LocaleProvider.formatMessage(LocaleProvider.IDs.label.saving)
                : LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.saveChanges,
                  )}
            </AppText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
