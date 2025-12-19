import { Alert, TouchableOpacity, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
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
import { useUpdateTodo, useDeleteTodo } from '../../../react-query';
import { Conditional } from '../../../../../app/components/conditional';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';

export const TodoListItem = ({ item }: { item: Todo }) => {
  const styles = useStyles();
  const translateX = useSharedValue(0);

  const handleItemPress = () => {
    navigationRef.navigate('EditTodoScreen', { todoItem: item });
  };
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleDeleteTodo = async () => {
    try {
      await deleteTodoMutation.mutateAsync(item?.id);
    } catch (err) {
      Alert.alert('Error', 'Unable to delete todo');
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
          'Error',
          'Unable to maek todo as completed. Please try again.',
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
        marginBottom: Layout.heightPercentageToDP(1),
      }}
    >
      <Animated.View style={[deleteStyle, styles.deleteActionContainer]}>
        <TouchableOpacity
          onPress={handleDeleteTodo}
          style={styles.deleteActionWrapper}
        >
          <AppIcon
            name={AppIconName.trash}
            color={Colors.white}
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
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
            tintColors={{
              true: Colors.brand['DEFAULT'],
              false: Colors.white,
            }}
            onValueChange={handleCompleteTodo}
          />
          {/* </Conditional> */}
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
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
