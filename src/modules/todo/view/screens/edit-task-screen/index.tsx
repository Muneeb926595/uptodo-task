import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { EditTaskHeader } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { ScreenProps } from '../../../../../app/navigation';
import { Constants, Layout } from '../../../../../app/globals';
import CheckBox from '@react-native-community/checkbox';
import { Colors } from '../../../../../app/theme';
import { AppText } from '../../../../../app/components/text';
import { formatTodoDateTime } from '../../../../../app/utils';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { EditTodoActionType, EditTodoOptions } from './types';
import { Conditional } from '../../../../../app/components/conditional';
import { Button } from '../../../../../app/components/button';

export const EditTaskScreen = (props: ScreenProps<'EditTaskScreen'>) => {
  const styles = useStyles();

  const [totoActions, setTotoActions] = useState<EditTodoOptions[]>([
    {
      id: EditTodoActionType.TaskDueDate,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.taskTime),
      leftIconName: AppIconName.timer,
    },
    {
      id: EditTodoActionType.TaskCategory,
      title: LocaleProvider.formatMessage(
        LocaleProvider.IDs.label.taskCategory,
      ),
      leftIconName: AppIconName.tag,
    },
    {
      id: EditTodoActionType.TaskPriority,
      title: LocaleProvider.formatMessage(
        LocaleProvider.IDs.label.taskPriorityWithColon,
      ),
      leftIconName: AppIconName.flag,
    },
    {
      id: EditTodoActionType.TaskSubTask,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.subTask),
      leftIconName: AppIconName.tree,
    },
    {
      id: EditTodoActionType.DeleteTask,
      title: LocaleProvider.formatMessage(LocaleProvider.IDs.label.deleteTask),
      leftIconName: AppIconName.trash,
      isDanger: true,
    },
  ]);

  const todo = props.route.params?.todoItem;

  const handleCompleteTask = () => {};

  const handleEditTitle = () => {};

  const doSelectedOperation = async (selectedOp: string) => {
    switch (selectedOp) {
      case EditTodoActionType.TaskDueDate:
        break;
    }
  };

  const handleEditTask = () => {};

  return (
    <Container
      insetsToHandle={['left', 'right']}
      screenBackgroundStyle={{
        flex: 1,
        paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
      }}
      containerStyles={{ flex: 1 }}
    >
      <EditTaskHeader title="" />
      <View style={styles.container}>
        {/* task title and description */}
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
              onValueChange={handleCompleteTask}
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
            <TouchableOpacity
              onPress={() => doSelectedOperation(item?.id)}
              style={styles.sectionsContainer}
            >
              <View
                style={[
                  styles.row,
                  { columnGap: Layout.widthPercentageToDP(2) },
                ]}
              >
                <AppIcon
                  name={item?.leftIconName!}
                  color={item?.isDanger ? Colors.red : Colors.white}
                  iconSize={AppIconSize.primary}
                />
                <AppText
                  style={[
                    styles.sectionLabel,
                    { color: item?.isDanger ? Colors.red : Colors.white },
                  ]}
                >
                  {item?.title}
                </AppText>
              </View>
              <Conditional ifTrue={!item?.isDanger}>
                <View style={styles.sectionActionContainer}>
                  <AppText style={styles.sectionActionLabel}>
                    {formatTodoDateTime(todo?.dueDate)}
                  </AppText>
                </View>
              </Conditional>
            </TouchableOpacity>
          )}
        />
      </View>
      <Button
        buttonLable={LocaleProvider.formatMessage(
          LocaleProvider.IDs.label.editTask,
        )}
        onPress={handleEditTask}
        buttonContainer={{ marginBottom: Layout.heightPercentageToDP(5) }}
      />
    </Container>
  );
};
