import { Alert, TouchableOpacity, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { styles } from './styles';
import CheckBox from '@react-native-community/checkbox';
import { Todo } from '../../../../../types';
import { useTheme } from '../../../../../theme';
import { useToast } from '../../../../../context';
import {
  useDeleteTodo,
  useRestoreTodo,
  useUpdateTodo,
} from '../../../../../react-query';
import { navigationRef } from '../../../../navigation';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../../services/localisation';
import {
  AppIcon,
  AppText,
  Conditional,
  CustomImage,
} from '../../../../components';
import { AppIconName, AppIconSize } from '../../../../components/icon/types';
import { formatTodoDateTime } from '../../../../../utils';
import { Images, Layout } from '../../../../../globals';

export const TodoListItem = ({ item }: { item: Todo }) => {
  const { theme } = useTheme();
  const translateX = useSharedValue(0);
  const { showToast } = useToast();

  // Priority color based on isOverdue and priority level
  const priorityColor = item.isOverdue
    ? theme.colors.red
    : item.priority >= 8
    ? theme.colors.brand.DEFAULT
    : item.priority >= 5
    ? '#F4D35E'
    : '#7DDB9B';

  const handleItemPress = () => {
    navigationRef.navigate('EditTodoScreen', { todoItem: item });
  };
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const restoreTodoMutation = useRestoreTodo();

  const handleDeleteTodo = async () => {
    try {
      await deleteTodoMutation.mutateAsync(item?.id);

      // Show toast with undo option
      showToast('Task deleted', 'UNDO', async () => {
        try {
          await restoreTodoMutation.mutateAsync(item?.id);
        } catch (err) {
          Alert.alert(
            LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
            LocaleProvider.formatMessage(
              LocaleProvider.IDs.message.unableToRestoreTask,
            ),
          );
        }
      });
    } catch (err) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.unableToDeleteTodo,
        ),
      );
    }
  };

  const handleCompleteTodo = async () => {
    const payload = {
      isCompleted: !item?.isCompleted,
    };

    // add a slight delay to show the checkbox animation
    setTimeout(async () => {
      try {
        await updateTodoMutation.mutateAsync({
          id: item?.id,
          patch: payload,
        });
      } catch (err) {
        Alert.alert(
          LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
          LocaleProvider.formatMessage(
            LocaleProvider.IDs.message.unableToMarkTodoAsCompleted,
          ),
        );
      }
    }, 600);
  };

  // Cuberto-style swipe gesture with elastic spring
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate(e => {
      // Allow swipe left (negative) or right (positive) to close
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -120);
      } else if (translateX.value < 0) {
        // Allow right swipe to close when already open
        translateX.value = Math.min(translateX.value + e.velocityX * 0.01, 0);
      }
    })
    .onEnd(() => {
      if (translateX.value < -70) {
        // Keep it open at -120 for user to tap delete
        translateX.value = withSpring(-120, {
          damping: 15,
          stiffness: 150,
          overshootClamping: false,
        });
      } else {
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  // Item animation - scales down and translates (Cuberto style)
  const itemStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, -120],
      [1, 0.92],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX: translateX.value }, { scale }],
    };
  });

  // Delete background scales up from behind
  const deleteStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, -120],
      [0.5, 1],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      translateX.value,
      [0, -40, -120],
      [0, 0.7, 1],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View
      style={{
        overflow: 'hidden',
      }}
    >
      <Animated.View style={[deleteStyle, styles.deleteActionContainer]}>
        <TouchableOpacity
          onPress={handleDeleteTodo}
          style={styles.deleteActionWrapper}
        >
          <AppIcon
            name={AppIconName.trash}
            color={theme.colors.white}
            iconSize={AppIconSize.primary}
          />
          <AppText style={styles.deleteActionLabel}>
            <FormattedMessage id={LocaleProvider.IDs.label.delete} />
          </AppText>
        </TouchableOpacity>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.todoItem, itemStyle]}>
          {/* <Conditional ifTrue={!item?.isCompleted}> */}
          <CheckBox
            value={item?.isCompleted}
            boxType="circle"
            style={styles.checkboxScale}
            tintColors={{
              true: theme.colors.brand.DEFAULT,
              false: theme.colors.white,
            }}
            onValueChange={handleCompleteTodo}
          />
          {/* </Conditional> */}
          <TouchableOpacity
            style={styles.todoContentContainer}
            onPress={handleItemPress}
          >
            <AppText style={styles.todoItemLabel}>{item?.title}</AppText>
            <View style={styles.rowBetween}>
              <AppText style={styles.todoItemTime}>
                {formatTodoDateTime(item?.dueDate)}
              </AppText>

              <View style={styles.categoryGapRow}>
                <Conditional ifTrue={!!item?.category}>
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
                </Conditional>
                <View style={styles.todoItemPriorityContainer}>
                  <AppIcon
                    name={AppIconName.flag}
                    iconSize={AppIconSize.mini}
                    color={priorityColor}
                    style={styles.flagIcon}
                  />
                  <AppText style={styles.todoItemPriorityLabel}>
                    {item?.priority}
                  </AppText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
