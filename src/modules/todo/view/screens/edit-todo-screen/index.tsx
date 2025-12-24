import React, { useLayoutEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { styles } from './styles';
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

type EditTodoFormData = {
  title: string;
  description: string;
  category: Category;
  priority: PriorityLevel;
  dueDate: Date | null;
  isCompleted: boolean;
  attachments: string[] | undefined;
};

export const EditTodoScreen = (props: ScreenProps<'EditTodoScreen'>) => {
  const updateTodoMutation = useUpdateTodo();
  const todo = props.route.params?.todoItem;

  const { control, handleSubmit, setValue, watch } = useForm<EditTodoFormData>({
    defaultValues: {
      title: todo?.title || '',
      description: (todo?.description as string) || '',
      category: todo?.category as Category,
      priority: todo?.priority || 1,
      dueDate: todo?.dueDate ? new Date(todo.dueDate) : null,
      isCompleted: todo?.isCompleted ?? false,
      attachments: todo?.attachments,
    },
  });

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

  const title = watch('title');
  const description = watch('description');
  const category = watch('category');
  const priority = watch('priority');
  const selectedDate = watch('dueDate');
  const attachments = watch('attachments');

  useLayoutEffect(() => {
    if (todo) {
      setValue('title', todo?.title);
      setValue('description', (todo?.description as string) || '');
      setValue('dueDate', todo?.dueDate ? new Date(todo.dueDate) : null);
      setValue('category', todo?.category as Category);
      setValue('priority', todo?.priority);
      setValue('isCompleted', todo?.isCompleted ?? false);
      setValue('attachments', todo?.attachments);
    }
  }, [todo, setValue]);

  const handleEditTitleConfirmation = (newValues: {
    title: string;
    description: string;
  }) => {
    setValue('title', newValues.title);
    setValue('description', newValues.description);
    magicModal.hideAll();
  };

  const handleEditTitle = async () => {
    await magicModal.show(
      () => (
        <EditTodoTitles
          todoTitle={title}
          todoDescription={description}
          onCancel={() => magicModal.hideAll()}
          onConfirm={handleEditTitleConfirmation}
        />
      ),
      { swipeDirection: undefined },
    ).promise;
  };

  const onSubmit = async (data: EditTodoFormData) => {
    magicModal.hideAll();
    magicSheet.hide();

    if (!data.title?.trim?.()) {
      return Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.pleaseEnterTaskTitle,
        ),
      );
    }

    if (!data.category?.id) {
      return Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.pleaseSelectCategory,
        ),
      );
    }

    if (!data.dueDate) {
      return Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.pleaseSelectDueDate,
        ),
      );
    }

    const payload = {
      title: data.title.trim(),
      description: data.description?.trim?.(),
      dueDate: dayjs(data.dueDate).valueOf(),
      todoTime: dayjs(data.dueDate).format('HH:mm'),
      priority: data.priority,
      categoryId: data.category?.id,
      isCompleted: data.isCompleted,
      attachments: data.attachments,
    };

    try {
      await updateTodoMutation.mutateAsync({
        id: todo?.id,
        patch: payload,
      });
      props.navigation.goBack();
    } catch (err) {
      Alert.alert(
        LocaleProvider.formatMessage(LocaleProvider.IDs.label.error),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.message.unableToUpdateTodo,
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
            <Controller
              control={control}
              name="isCompleted"
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  value={value}
                  boxType="circle"
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                  }}
                  tintColors={{
                    true: Colors.brand['DEFAULT'],
                    false: Colors.white,
                  }}
                  onValueChange={onChange}
                />
              )}
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
              setSelectedDate={date => setValue('dueDate', date)}
              setCategory={cat => setValue('category', cat)}
              setPriority={prio => setValue('priority', prio)}
              attachments={attachments}
              setAttachments={att => setValue('attachments', att)}
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
        onPress={handleSubmit(onSubmit)}
        buttonContainer={{ marginBottom: Layout.heightPercentageToDP(5) }}
      />
    </Container>
  );
};
