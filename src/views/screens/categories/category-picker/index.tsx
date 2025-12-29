import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { styles } from './styles';
import { AppText } from '../../../components/text';
import { Divider } from '../../../components/divider';
import { useCategories } from '../../../../react-query/categories/hooks';
import { Category } from '../../../../types/categories.types';
import { Images, Layout } from '../../../../globals';
import { FormattedMessage } from '../../../../services/localisation/locale-formatter';
import { LocaleProvider } from '../../../../services/localisation/locale-provider';
import { magicModal } from 'react-native-magic-modal';
import { CustomImage } from '../../../components/custom-image';
import { Platform } from 'react-native';
import { CreateNewCategoryModal } from '../create-new-category-screen';
import { navigationRef } from '../../../../navigation';

type Props = {
  onConfirm: (category: Category) => void;
};

type CategoryItemProps = {
  item: Category;
  onPress: (selectedCategory: Category) => void;
};

const RenderCategoryItem = ({ item, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[styles.categoryItemContainer]}
    >
      <View
        style={[styles.categoryimageContainer, { backgroundColor: item.color }]}
      >
        <CustomImage
          uri={item?.icon}
          imageStyles={styles.categoryIcon}
          placeHolder={Images.DefaultTodo}
          resizeMode="cover"
        />
      </View>
      <AppText style={[styles.categoryName]} numberOfLines={1}>
        {item.name}
      </AppText>
    </TouchableOpacity>
  );
};

export const TodoCategoryPicker = ({ onConfirm }: Props) => {
  const { data: categories, isLoading } = useCategories();

  const handleAddCategory = () => {
    if (Platform.OS === 'android') {
      // On Android, show CreateNewCategoryScreen inside magic modal to appear above bottom sheet
      magicModal.show(() => <CreateNewCategoryModal />, {
        swipeDirection: undefined,
      });
    } else {
      magicModal.hideAll();
      // On iOS, navigate to the screen normally (works fine)
      navigationRef.navigate('CreateNewCategoryScreen');
    }
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.container}>
        <AppText style={styles.heading}>
          <FormattedMessage id={LocaleProvider.IDs.label.chooseCategory} />
        </AppText>
        <Divider />

        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <FlatList
            data={categories}
            numColumns={3}
            style={{
              marginTop: Layout.heightPercentageToDP(2.4),
              paddingBottom: Layout.widthPercentageToDP(6),
            }}
            keyExtractor={item => item.id}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <RenderCategoryItem item={item} onPress={onConfirm} />
            )}
          />
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={handleAddCategory}
            style={styles.chooseBtn}
          >
            <AppText style={styles.chooseText}>
              <FormattedMessage id={LocaleProvider.IDs.label.addCategory} />
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
