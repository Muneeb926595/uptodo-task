import { TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { AppText } from '../../../../../app/components/text';
import { formatTodoDateTime } from '../../../../../app/utils';
import { Todo } from '../../../types';
import { CustomImage } from '../../../../../app/components/custom-image';
import { Images, Layout } from '../../../../../app/globals';
import { AppIcon } from '../../../../../app/components/icon';
import CheckBox from '@react-native-community/checkbox';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { navigationRef } from '../../../../../app/navigation';
import { Conditional } from '../../../../../app/components/conditional';

export const TodoListItem = ({ item }: { item: Todo }) => {
  const styles = useStyles();
  const handleItemPress = () => {
    navigationRef.navigate('EditTodoScreen', { todoItem: item });
  };

  const handleCompleteTodo = () => {};
  return (
    <View style={styles.todoItem}>
      <Conditional ifTrue={!item?.isCompleted}>
        <CheckBox
          boxType="circle"
          style={{
            transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
          }}
          tintColors={{
            true: Colors.brand['DEFAULT'],
            false: Colors.white,
          }}
          onValueChange={handleCompleteTodo}
        />
      </Conditional>
      <TouchableOpacity style={{ flex: 1 }} onPress={handleItemPress}>
        <AppText style={styles.todoItemLabel}>{item?.title}</AppText>
        <View style={styles.rowBetween}>
          <AppText style={styles.todoItemTime}>
            {formatTodoDateTime(item?.dueDate)}
          </AppText>

          <View
            style={[
              styles.row,
              {
                columnGap: Layout.widthPercentageToDP(3),
              },
            ]}
          >
            <View
              style={[
                styles.todoItemCategoryContainer,
                { backgroundColor: item?.category?.color },
              ]}
            >
              <CustomImage
                uri={item?.category?.icon}
                imageStyles={styles.categoryIcon}
                placeHolder={Images.DefaultTodo}
                resizeMode="cover"
              />
              <AppText style={styles.todoItemCategoryLabel}>
                {item?.category?.name}
              </AppText>
            </View>
            <View style={styles.todoItemPriorityContainer}>
              <AppIcon
                name={AppIconName.flag}
                iconSize={AppIconSize.mini}
                color={Colors.white}
                style={{ marginRight: Layout.widthPercentageToDP(1) }}
              />
              <AppText style={styles.todoItemPriorityLabel}>
                {item?.priority}
              </AppText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
