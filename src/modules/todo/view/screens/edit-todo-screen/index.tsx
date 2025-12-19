import React, { useLayoutEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { EditTodoHeader } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { ScreenProps } from '../../../../../app/navigation';
import { Constants, Layout } from '../../../../../app/globals';
import CheckBox from '@react-native-community/checkbox';
import { Colors } from '../../../../../app/theme';
import { AppText } from '../../../../../app/components/text';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { EditTodoActionType, EditTodoOptions } from './types';
import { Button } from '../../../../../app/components/button';
import { magicModal } from 'react-native-magic-modal';
import { magicSheet } from 'react-native-magic-sheet';
import { Category, PriorityLevel } from '../../../types';
import { EditTodoOptionsListItem } from '../../components/edit-todo-options-item';

export const EditTodoScreen = (props: ScreenProps<'EditTodoScreen'>) => {
  const styles = useStyles();

  const [totoActions] = useState<EditTodoOptions[]>([
    {
      id: EditTodoActionType.TodoDueDate,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.taskTime),
      leftIconName: AppIconName.timer,
    },
    {
      id: EditTodoActionType.TodoCategory,
      title: LocaleProvider.formatMessage(
        LocaleProvider.IDs.label.taskCategory,
      ),
      leftIconName: AppIconName.tag,
    },
    {
      id: EditTodoActionType.TodoPriority,
      title: LocaleProvider.formatMessage(
        LocaleProvider.IDs.label.taskPriorityWithColon,
      ),
      leftIconName: AppIconName.flag,
    },
    {
      id: EditTodoActionType.TodoSubTask,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.subTask),
      leftIconName: AppIconName.tree,
    },
    {
      id: EditTodoActionType.DeleteTodo,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.deleteTask),
      leftIconName: AppIconName.trash,
      isDanger: true,
    },
  ]);

  const todo = props.route.params?.todoItem;

  const [category, setCategory] = useState<Category>(
    todo?.category as Category,
  );
  const [priority, setPriority] = useState<PriorityLevel>(todo?.priority);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    todo?.dueDate ? new Date(todo.dueDate) : null,
  );

  useLayoutEffect(() => {
    if (todo) {
      setCategory(todo?.category as Category);
      setPriority(todo?.priority);
      setSelectedDate(todo?.dueDate ? new Date(todo.dueDate) : null);
    }
  }, [todo]);

  const handleCompleteTodo = () => {};

  const handleEditTitle = async () => {
    magicModal.hideAll();
    magicSheet.hide();

    // const payload = {
    //   title: data?.title?.trim?.(),
    //   description: data?.description?.trim?.(),
    //   dueDate: dayjs(selectedDate).valueOf(), //timestamp in ms
    //   todoTime: dayjs(selectedDate).format('HH:mm'),
    //   priority,
    //   categoryId,
    //   attachments: [imageUri] as string[],
    // };

    try {
      // await createTodoMutation.mutateAsync(payload);
    } catch (err) {
      Alert.alert('Error', 'Unable to update todo');
    }
  };

  const handleEditTodo = () => {};

  return (
    <Container
      insetsToHandle={['left', 'right']}
      screenBackgroundStyle={{
        flex: 1,
        paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
      }}
      containerStyles={{ flex: 1 }}
    >
      <EditTodoHeader title="" />
      <View style={styles.container}>
        {/* todo title and description */}
        <View
          style={[
            styles.rowBetween,
            { marginTop: Layout.heightPercentageToDP(3) },
          ]}
        >
          <View
            style={[styles.row, { columnGap: Layout.widthPercentageToDP(2) }]}
          >
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
            <View>
              <AppText style={styles.todoItemLabel}>{todo?.title}</AppText>
              <AppText style={styles.todoItemTime}>{todo?.description}</AppText>
            </View>
          </View>

          <TouchableOpacity onPress={handleEditTitle}>
            <AppIcon
              name={AppIconName.edit}
              color={Colors.white}
              iconSize={AppIconSize.primary}
            />
          </TouchableOpacity>
        </View>

        {/* sections */}

        <FlatList
          data={totoActions}
          renderItem={({ item }: { item: EditTodoOptions }) => (
            <EditTodoOptionsListItem
              item={item}
              setSelectedDate={setSelectedDate}
              setCategory={setCategory}
              setPriority={setPriority}
              selectedDate={selectedDate}
              category={category}
              priority={priority}
              todoTitle={todo?.title!}
            />
          )}
        />
      </View>
      <Button
        buttonLable={LocaleProvider.formatMessage(
          LocaleProvider.IDs.label.editTask,
        )}
        onPress={handleEditTodo}
        buttonContainer={{ marginBottom: Layout.heightPercentageToDP(5) }}
      />
    </Container>
  );
};
