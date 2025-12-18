import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { HomeHeader } from '../../../../todo/view/components';
import { useStyles } from './styles';
import { ScreenProps } from '../../../../../app/navigation';
import { AppText } from '../../../../../app/components/text';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { Constants, Images, Layout } from '../../../../../app/globals';
import { AuthInput } from '../../../../../app/components/inputs';
import { FlatList } from 'react-native-gesture-handler';
import { useImagePicker } from '../../../../../app/hooks';
import { useCreateCategory } from '../../../react-query/hooks';
import { CustomImage } from '../../../../../app/components/custom-image';
import { Conditional } from '../../../../../app/components/conditional';
import { PickedImage } from '../../../../../app/services/media/mediaService';

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

export const CreateNewCategoryScreen = (
  props: ScreenProps<'CreateNewCategoryScreen'>,
) => {
  const styles = useStyles();

  const { pickAndUpload, isLoading, imageUri } = useImagePicker();

  const createCategoryMutation = useCreateCategory();

  const [categoryName, setCategoryName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleColorPress = (selectedItem: string) => {
    setSelectedColor(selectedItem);
  };

  const onCancel = () => {
    props.navigation.goBack();
  };

  const handleCreateCategory = async () => {
    if (categoryName?.trim?.()?.length <= 0) {
      return Alert.alert('Please enter Category name');
    }
    if ((imageUri ?? '')?.toString?.()?.trim?.()?.length <= 0) {
      return Alert.alert('Please select image');
    }
    if (selectedColor?.trim?.()?.length <= 0) {
      return Alert.alert('Please Choose color');
    }

    // persist category to local storage via repository + react-query

    try {
      await createCategoryMutation.mutateAsync({
        name: categoryName?.trim?.(),
        icon: imageUri ?? undefined,
        color: selectedColor,
        isSystem: false,
      });
      props.navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Unable to create category');
    }
  };

  return (
    <Container
      insetsToHandle={['top', 'left', 'right']}
      screenBackgroundStyle={{
        flex: 1,
        paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
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
        <AuthInput
          value={categoryName}
          onChange={setCategoryName}
          onBlur={() => {}}
          placeholder={LocaleProvider.formatMessage(
            LocaleProvider.IDs.label.categoryNameWithoutColon,
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
          keyExtractor={(item, index) => index.toString()}
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
            onPress={handleCreateCategory}
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
