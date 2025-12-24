import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LocaleProvider } from '../../../../services/localisation';
import { Container } from '../../../../views/components/container';
import { styles } from './styles';
import { ScreenProps } from '../../../navigation';
import { AppText } from '../../../../views/components/text';
import { FormattedMessage } from '../../../../services/localisation';
import { Constants, Images, Layout } from '../../../../globals';
import { FlatList } from 'react-native-gesture-handler';
import { useImagePicker } from '../../../../hooks';
import { useCreateCategory } from '../../../../react-query/categories/hooks';
import { CustomImage } from '../../../../views/components/custom-image';
import { Conditional } from '../../../../views/components/conditional';
import { mediaService, PickedImage } from '../../../../services/media';
import { AuthInput } from '../../../../views/components/auth-input';

const CATEGORY_COLORS = [
  '#FF9A85', // Muted Red
  '#7DDB9B', // Muted Green
  '#8FA8FF', // Muted Blue
  '#F4D35E', // Muted Yellow
  '#C39BD3', // Muted Purple
  '#F0A45D', // Muted Orange
  '#6FD5C6', // Muted Turquoise
  '#F48FB1', // Muted Pink
];

type CategoryFormData = {
  categoryName: string;
  selectedColor: string;
};

export const CreateNewCategoryScreen = (
  props: ScreenProps<'CreateNewCategoryScreen'>,
) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      categoryName: '',
      selectedColor: '',
    },
  });

  const selectedColor = watch('selectedColor');

  const persistImageOnPhoneStorage = async (imageObj: PickedImage) => {
    const persistedUri = await mediaService.persistImage(imageObj?.uri);
    console.log('persistedUri', persistedUri);
    return persistedUri;
  };

  const { pickAndUpload, imageUri } = useImagePicker({
    uploader: persistImageOnPhoneStorage,
  });

  const createCategoryMutation = useCreateCategory();

  const handleColorPress = (selectedItem: string) => {
    setValue('selectedColor', selectedItem);
  };

  const onCancel = () => {
    props.navigation.goBack();
  };

  const onSubmit = async (data: CategoryFormData) => {
    if (data.categoryName?.trim?.()?.length <= 0) {
      return Alert.alert(
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.pleaseEnterCategoryName,
        ),
      );
    }
    if ((imageUri ?? '')?.toString?.()?.trim?.()?.length <= 0) {
      return Alert.alert(
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.pleaseSelectImage,
        ),
      );
    }
    if (data.selectedColor?.trim?.()?.length <= 0) {
      return Alert.alert(
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.pleaseChooseColor,
        ),
      );
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: data.categoryName?.trim?.(),
        icon: imageUri ?? undefined,
        color: data.selectedColor,
        isSystem: false,
      });
      props.navigation.goBack();
    } catch (err) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.unableToCreateCategory,
        ),
      );
    }
  };

  return (
    <Container
      insetsToHandle={['left', 'right', 'bottom']}
      screenBackgroundStyle={{
        flex: 1,
        paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
        paddingVertical: Layout.heightPercentageToDP(2),
      }}
      containerStyles={{ flex: 1 }}
    >
      <AppText style={styles.header}>
        <FormattedMessage id={LocaleProvider.IDs.label.createNewCategory} />
      </AppText>
      <View style={styles.container}>
        <AppText style={styles.inputlabel}>
          <FormattedMessage id={LocaleProvider.IDs.label.categoryName} />
        </AppText>
        <Controller
          control={control}
          name="categoryName"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthInput
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={LocaleProvider.formatMessage(
                LocaleProvider.IDs.label.categoryNameWithoutColon,
              )}
            />
          )}
        />

        <AppText style={styles.inputlabel}>
          <FormattedMessage id={LocaleProvider.IDs.label.categoryIcon} />
        </AppText>

        <TouchableOpacity
          onPress={pickAndUpload}
          style={styles.chooseIconButton}
        >
          <Conditional
            ifTrue={imageUri}
            elseChildren={
              <AppText style={styles.chooseIconButtonLabel}>
                <FormattedMessage
                  id={LocaleProvider.IDs.label.chooseiconFromlibrary}
                />
              </AppText>
            }
          >
            <CustomImage
              uri={imageUri}
              imageStyles={styles.selectedImage}
              placeHolder={Images.Avatar}
              resizeMode="cover"
            />
          </Conditional>
        </TouchableOpacity>

        <AppText style={styles.inputlabel}>
          <FormattedMessage id={LocaleProvider.IDs.label.categoryColor} />
        </AppText>
        <FlatList
          horizontal
          data={CATEGORY_COLORS}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.colorCircle,
                { backgroundColor: item },
                selectedColor === item && styles.selectedColor,
              ]}
              onPress={() => handleColorPress(item)}
            />
          )}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onCancel}>
            <AppText style={styles.cancel}>
              <FormattedMessage id={LocaleProvider.IDs.general.cancel} />
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.chooseBtn}
          >
            <AppText style={styles.chooseText}>
              <FormattedMessage id={LocaleProvider.IDs.label.createCategory} />
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};
