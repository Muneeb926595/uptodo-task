import { View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetWrapper } from '../../../../../app/components/bottom-sheet-wrapper';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { styles } from './styles';
import { Controller, useForm } from 'react-hook-form';
import { AppText } from '../../../../../app/components/text';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { AppIcon } from '../../../../../app/components/icon';
import { magicModal } from 'react-native-magic-modal';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { Constants, Images, Layout } from '../../../../../app/globals';
import { CalendarPicker } from '../../../../../app/components/calendar-picker';
import { magicSheet } from 'react-native-magic-sheet';
import { useCreateTodo } from '../../../react-query';
import dayjs from 'dayjs';
import { PriorityLevel } from '../../../types';
import { useImagePicker } from '../../../../../app/hooks';
import { Conditional } from '../../../../../app/components/conditional';
import { CustomImage } from '../../../../../app/components/custom-image';
import { mediaService, PickedImage } from '../../../../services/media';
import { TodoPriorityPicker } from '../todo-priority-picker';
import { TodoCategoryPicker } from '../../../../categories/view/components';
import { AuthInput } from '../../../../../app/components/auth-input';

export const CreateTodoBottomSheet = () => {
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

  const persistImageOnPhoneStorage = async (imageObj: PickedImage) => {
    const persistedUri = await mediaService.persistImage(imageObj?.uri);
    return persistedUri;
  };

  const { pickAndUpload, imageUri } = useImagePicker({
    uploader: persistImageOnPhoneStorage,
  });

  const [categoryId, setCategoryId] = useState<string>();
  const [priority, setPriority] = useState<PriorityLevel>();
  const [selectedDate, setSelectedDate] = useState<Date | null>();

  const createTodoMutation = useCreateTodo();

  const handleOpenCalendar = async () => {
    await magicModal.show(
      () => (
        <CalendarPicker
          onCancel={() => magicModal.hideAll()}
          onConfirm={date => {
            setSelectedDate(date);
            magicModal.hideAll();
          }}
        />
      ),
      { swipeDirection: undefined },
    ).promise;
  };

  const handleOpenPriorityPicker = async () => {
    await magicModal.show(
      () => (
        <TodoPriorityPicker
          onCancel={() => magicModal.hideAll()}
          onConfirm={priority => {
            setPriority(priority);
            magicModal.hideAll();
          }}
        />
      ),
      { swipeDirection: undefined },
    ).promise;
  };

  const handleOpenCategoryPicker = async () => {
    await magicModal.show(
      () => (
        <TodoCategoryPicker
          onConfirm={category => {
            setCategoryId(category?.id);
            magicModal.hideAll();
          }}
        />
      ),
      { swipeDirection: undefined },
    ).promise;
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
      attachments: [imageUri] as string[],
    };

    try {
      await createTodoMutation.mutateAsync(payload);
    } catch (err) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.unableToCreateTodo,
        ),
      );
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
                useBottomSheetTextInput
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
                useBottomSheetTextInput
              />
            )}
            name="description"
          />
          {errors?.description && (
            <AppText style={styles.error}>
              <FormattedMessage id={LocaleProvider.IDs.error.fieldIsRequired} />
            </AppText>
          )}

          <TouchableOpacity
            hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
            style={styles.galleryPicker}
            onPress={pickAndUpload}
          >
            <Conditional
              ifTrue={imageUri}
              elseChildren={
                <AppIcon
                  name={AppIconName.image}
                  color={Colors.white}
                  iconSize={AppIconSize.xxlarge}
                />
              }
            >
              <CustomImage
                uri={imageUri}
                imageStyles={styles.attachment}
                placeHolder={Images.DefaultTodo}
                resizeMode="cover"
              />
            </Conditional>
          </TouchableOpacity>

          <View
            style={[
              styles.rowBetween,
              { marginTop: Layout.heightPercentageToDP(2) },
            ]}
          >
            <View
              style={[styles.row, { columnGap: Layout.widthPercentageToDP(8) }]}
            >
              <TouchableOpacity
                hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
                onPress={handleOpenCalendar}
              >
                <AppIcon
                  name={AppIconName.timer}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
                onPress={handleOpenCategoryPicker}
              >
                <AppIcon
                  name={AppIconName.tag}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
                onPress={handleOpenPriorityPicker}
              >
                <AppIcon
                  name={AppIconName.flag}
                  color={Colors.white}
                  iconSize={AppIconSize.primary}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
              onPress={handleSubmit(handleCreateTodo)}
            >
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
