import { View, TouchableOpacity, Alert } from 'react-native';
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
import { magicModal } from 'react-native-magic-modal';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { Layout } from '../../../../../app/globals';
import { CalendarPicker } from '../../../../../app/components/calendar-picker';
import { TaskPriorityPicker } from '../task-priority-picker';
import { TaskCategoryPicker } from '../../../../categories/view/components';
import { magicSheet } from 'react-native-magic-sheet';
import { useCreateTodo } from '../../../react-query';
import dayjs from 'dayjs';
import { PriorityLevel } from '../../../types';

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

  const [categoryId, setCategoryId] = useState<string>();
  const [priority, setPriority] = useState<PriorityLevel>();
  const [selectedDate, setSelectedDate] = useState<Date | null>();

  const createTodoMutation = useCreateTodo();

  const handleOpenCalendar = async () => {
    const result = await magicModal.show(() => (
      <CalendarPicker
        onCancel={() => magicModal.hideAll()}
        onConfirm={date => {
          setSelectedDate(date);
          magicModal.hideAll();
        }}
      />
    )).promise;
  };

  const handleOpenPriorityPicker = async () => {
    const result = await magicModal.show(() => (
      <TaskPriorityPicker
        onCancel={() => magicModal.hideAll()}
        onConfirm={priority => {
          setPriority(priority);
          magicModal.hideAll();
        }}
      />
    )).promise;
  };

  const handleOpenCategoryPicker = async () => {
    const result = await magicModal.show(() => (
      <TaskCategoryPicker
        onConfirm={category => {
          setCategoryId(category?.id);
          magicModal.hideAll();
        }}
      />
    )).promise;
  };

  const handleCreateTodo = async (data: {
    title: string;
    description: string;
  }) => {
    magicModal.hideAll();
    magicSheet.hide();

    const payload = {
      title: data?.title?.trim?.(),
      description: data?.description?.trim?.(),
      dueDate: dayjs(selectedDate).valueOf(), //timestamp in ms
      todoTime: dayjs(selectedDate).format('HH:mm'),
      priority,
      categoryId,
    };

    try {
      await createTodoMutation.mutateAsync(payload);
    } catch (err) {
      Alert.alert('Error', 'Unable to create todo');
    }
  };

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
              <TouchableOpacity onPress={handleOpenCalendar}>
                <AppIcon
                  name={AppIconName.timer}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenCategoryPicker}>
                <AppIcon
                  name={AppIconName.tag}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenPriorityPicker}>
                <AppIcon
                  name={AppIconName.flag}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSubmit(handleCreateTodo)}>
              <AppIcon
                name={AppIconName.send}
                color={Colors.brand['DEFAULT']}
                iconSize={AppIconSize.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetWrapper>
  );
};
