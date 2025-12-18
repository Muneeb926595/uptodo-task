import { View, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetWrapper } from '../../../../../app/components/bottom-sheet-wrapper';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { useStyles } from './styles';
import { Controller, useForm } from 'react-hook-form';
import { AuthInput } from '../../../../../app/components/inputs';
import { AppText } from '../../../../../app/components/text';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { Layout } from '../../../../../app/globals';

type Props = {
  userName?: string;
  onUserProfileUpdationSuccess?: () => void;
};

export const CreateTodoBottomSheet = (props: Props) => {
  const styles = useStyles();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  return (
    <BottomSheetWrapper
      headerTitle={LocaleProvider.formatMessage(
        LocaleProvider.IDs.label.addTask,
      )}
    >
      <BottomSheetScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={LocaleProvider.formatMessage(
                  LocaleProvider.IDs.label.taskName,
                )}
                isError={errors?.title}
              />
            )}
            name="title"
          />
          {errors?.title && (
            <AppText style={styles.error}>
              <FormattedMessage id={LocaleProvider.IDs.error.fieldIsRequired} />
            </AppText>
          )}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={LocaleProvider.formatMessage(
                  LocaleProvider.IDs.label.description,
                )}
                isError={errors?.description}
              />
            )}
            name="description"
          />
          {errors?.description && (
            <AppText style={styles.error}>
              <FormattedMessage id={LocaleProvider.IDs.error.fieldIsRequired} />
            </AppText>
          )}

          <View
            style={[
              styles.rowBetween,
              { marginTop: Layout.heightPercentageToDP(2) },
            ]}
          >
            <View
              style={[styles.row, { columnGap: Layout.widthPercentageToDP(8) }]}
            >
              <TouchableOpacity>
                <AppIcon
                  name={AppIconName.timer}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <AppIcon
                  name={AppIconName.tag}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <AppIcon
                  name={AppIconName.flag}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
            </View>
            <AppIcon
              name={AppIconName.send}
              color={Colors.brand['DEFAULT']}
              iconSize={AppIconSize.primary}
            />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetWrapper>
  );
};
