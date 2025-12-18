import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useStyles } from './styles';
import { AppText } from '../../../../../app/components/text';
import { Divider } from '../../../../../app/components/divider';
import { useCategories } from '../../../react-query/hooks';
import { Category } from '../../../types/categories.types';
import { Colors } from '../../../../../app/theme';
import { Images, Layout } from '../../../../../app/globals';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { navigationRef } from '../../../../../app/navigation';
import { magicModal } from 'react-native-magic-modal';
import { magicSheet } from 'react-native-magic-sheet';
import { CustomImage } from '../../../../../app/components/custom-image';

type Props = {
  onConfirm: (category: Category) => void;
};

type CategoryItemProps = {
  item: Category;
  onPress: (selectedCategory: Category) => void;
};

const RenderCategoryItem = ({ item, onPress }: CategoryItemProps) => {
  const styles = useStyles();

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

export const TaskCategoryPicker = ({ onConfirm }: Props) => {
  const styles = useStyles();

  const { data: categories, isLoading } = useCategories();

  const handleAddCategory = () => {
    magicSheet.hide();
    magicModal.hideAll();
    navigationRef.navigate('CreateNewCategoryScreen');
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
