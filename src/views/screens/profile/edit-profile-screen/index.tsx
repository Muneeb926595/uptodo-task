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
import { useForm, Controller } from 'react-hook-form';
import { styles } from '../profile-setup-screen/styles';
import { AppText } from '../../../../views/components/text';
import { useTheme } from '../../../../theme';
import { navigationRef } from '../../../navigation';
import { Container } from '../../../../views/components/container';
import { LocaleProvider } from '../../../../services/localisation';
import { useProfile, useUpdateProfile } from '../../../../react-query/profile';

type ProfileFormData = {
  name: string;
  email: string;
};

export const EditProfileScreen = () => {
  const { theme } = useTheme();
  const { data: profile } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const name = watch('name');
  const email = watch('email');

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      setValue('email', profile.email || '');
    }
  }, [profile, setValue]);

  const isNameValid = name.trim().length >= 2;
  const hasChanges =
    name.trim() !== profile?.name || email.trim() !== (profile?.email || '');

  const onSubmit = async (data: ProfileFormData) => {
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
      updateProfileMutation.mutate(
        {
          name: data.name.trim(),
          email: data.email.trim() || undefined,
        },
        {
          onSuccess: () => {
            setIsSubmitting(false);
            Alert.alert(
              LocaleProvider.formatMessage(LocaleProvider.IDs.label.success),
              LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.profileUpdatedSuccessfully,
              ),
              [
                {
                  text: LocaleProvider.formatMessage(
                    LocaleProvider.IDs.label.ok,
                  ),
                  onPress: () => navigationRef.goBack(),
                },
              ],
            );
          },
          onError: error => {
            setIsSubmitting(false);
            console.error('Error updating profile:', error);
            Alert.alert(
              LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
              LocaleProvider.formatMessage(
                LocaleProvider.IDs.message.failedToUpdateProfile,
              ),
            );
          },
        },
      );
    } catch (error) {
      setIsSubmitting(false);
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
      screenBackgroundStyle={styles.flexContainer}
      containerStyles={styles.flexContainer}
    >
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
            <Controller
              control={control}
              name="name"
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, nameFocused && styles.inputFocused]}
                  value={value}
                  onChangeText={onChange}
                  placeholder={LocaleProvider.formatMessage(
                    LocaleProvider.IDs.message.enterYourNamePlaceholder,
                  )}
                  placeholderTextColor={theme.colors.typography['400']}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => {
                    setNameFocused(false);
                    onBlur();
                  }}
                  autoCapitalize="words"
                  returnKeyType="next"
                  maxLength={50}
                />
              )}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <AppText style={styles.label}>
              {LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.emailOptional,
              )}
            </AppText>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, emailFocused && styles.inputFocused]}
                  value={value}
                  onChangeText={onChange}
                  placeholder={LocaleProvider.formatMessage(
                    LocaleProvider.IDs.message.enterYourEmailPlaceholder,
                  )}
                  placeholderTextColor={theme.colors.typography['400']}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => {
                    setEmailFocused(false);
                    onBlur();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  maxLength={100}
                />
              )}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isNameValid || !hasChanges || isSubmitting) &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
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
