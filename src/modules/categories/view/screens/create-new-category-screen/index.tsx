import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
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
import { CustomImage } from '../../../../../app/components/custom-image';
import { Conditional } from '../../../../../app/components/conditional';

const CATEGORY_COLORS = [
  '#FF5733', // Red
  '#33FF57', // Green
  '#3357FF', // Blue
  '#F1C40F', // Yellow
  '#9B59B6', // Purple
  '#E67E22', // Orange
  '#1ABC9C', // Turquoise
  '#E91E63', // Pink
];

export const CreateNewCategoryScreen = (
  props: ScreenProps<'CreateNewCategoryScreen'>,
) => {
  const styles = useStyles();

  const { pickAndUpload, isLoading, imageUri } = useImagePicker();

  const [categoryName, setCategoryName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleColorPress = (selectedItem: string) => {
    setSelectedColor(selectedItem);
  };

  const onCancel = () => {
    props.navigation.goBack();
  };

  const handleCreateCategory = () => {
    props.navigation.goBack();
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
              style={[styles.colorCircle, { backgroundColor: item }]}
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
