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
import dayjs from 'dayjs';
import { Category, PriorityLevel } from '../../../types';
import { useUpdateTodo } from '../../../react-query/hooks';
import { EditTodoOptionsListItem } from '../../components/edit-todo-options-item';
import { EditTodoTitles } from '../../components/edit-todo-titles';

export const EditTodoScreen = (props: ScreenProps<'EditTodoScreen'>) => {
  const styles = useStyles();

  const updateTodoMutation = useUpdateTodo();

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
      id: EditTodoActionType.TodoAttachments,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.attachments),
      leftIconName: AppIconName.image,
    },
    {
      id: EditTodoActionType.DeleteTodo,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.deleteTask),
      leftIconName: AppIconName.trash,
      isDanger: true,
    },
  ]);

  const todo = props.route.params?.todoItem;

  const [title, setTitle] = useState<string>(todo?.title);
  const [description, setDescription] = useState<string>(
    todo?.description as string,
  );
  const [category, setCategory] = useState<Category>(
    todo?.category as Category,
  );
  const [priority, setPriority] = useState<PriorityLevel>(todo?.priority);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    todo?.dueDate ? new Date(todo.dueDate) : null,
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    todo?.isCompleted ?? false,
  );
  const [attachments, setAttachments] = useState<string[] | undefined>(
    todo?.attachments,
  );

  useLayoutEffect(() => {
    if (todo) {
      setTitle(todo?.title);
      setDescription(todo?.description as string);
      setSelectedDate(todo?.dueDate ? new Date(todo.dueDate) : null);
      setCategory(todo?.category as Category);
      setPriority(todo?.priority);
      setIsCompleted(todo?.isCompleted ?? false);
      setAttachments(todo?.attachments);
    }
  }, [todo]);

  const handleCompleteTodo = (value: boolean) => {
    setIsCompleted(value);
  };

  const handleEditTitle = async () => {
    await magicModal.show(
      () => (
        <EditTodoTitles
          todoTitle={title}
          todoDescription={description}
          onCancel={() => magicModal.hideAll()}
          onConfirm={newValues => {
            setTitle(newValues.title);
            setDescription(newValues.description);
            magicModal.hideAll();
          }}
        />
      ),
      { swipeDirection: undefined },
    ).promise;
  };

  const handleEditTodo = async () => {
    magicModal.hideAll();
    magicSheet.hide();

    if (!title?.trim?.()) {
      return Alert.alert('Error', 'Please enter a task title');
    }

    if (!category?.id) {
      return Alert.alert('Error', 'Please select a category');
    }

    if (!selectedDate) {
      return Alert.alert('Error', 'Please select a due date');
    }

    const payload = {
      title: title.trim(),
      description: description?.trim?.(),
      dueDate: dayjs(selectedDate).valueOf(), // timestamp in ms
      todoTime: dayjs(selectedDate).format('HH:mm'),
      priority,
      categoryId: category?.id,
      isCompleted,
      attachments,
    };

    try {
      await updateTodoMutation.mutateAsync({
        id: todo?.id,
        patch: payload,
      });
      props.navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Unable to update todo');
    }
  };

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
              value={isCompleted}
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
              <AppText style={styles.todoItemLabel}>{title}</AppText>
              <AppText style={styles.todoItemTime}>{description}</AppText>
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
              attachments={attachments}
              setAttachments={setAttachments}
              selectedDate={selectedDate}
              category={category}
              priority={priority}
              todo={{
                id: todo?.id,
                title: todo?.title!,
              }}
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
