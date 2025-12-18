import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { HomeHeader } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { Conditional } from '../../../../../app/components/conditional';
import { CustomImage } from '../../../../../app/components/custom-image';
import { Images, Layout } from '../../../../../app/globals';
import { AppText } from '../../../../../app/components/text';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { CalendarPicker } from '../../../../../app/components/calendar-picker';
import { formatTodoDateTime } from '../../../../../app/utils';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { ScreenProps } from '../../../../../app/navigation';

let todos = [
  // 🟢 TODAY — ACTIVE (4)
  {
    id: 'todo-1',
    title: 'Do Math Homework',
    description: 'Complete calculus assignment',
    dueDate: Date.now(),
    todoTime: '16:45',
    timezone: 'Asia/Karachi',
    priority: '3',
    status: 'PENDING',
    category: {
      id: 'health',
      name: 'Health',
      color: '#FF5733',
    },
    parentId: null,
    order: 1,
    isCompleted: false,
    hasSubTasks: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    deletedAt: null,
  },
  {
    id: 'todo-2',
    title: 'Take out dogs',
    description: 'Evening walk',
    dueDate: Date.now(),
    todoTime: '18:20',
    timezone: 'Asia/Karachi',
    priority: '3',
    status: 'PENDING',
    category: {
      id: 'health',
      name: 'Health',
      color: '#FF5733',
    },
    parentId: null,
    order: 2,
    isCompleted: false,
    hasSubTasks: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    deletedAt: null,
  },
  {
    id: 'todo-3',
    title: 'Business meeting with CEO',
    description: 'Quarterly roadmap discussion',
    dueDate: Date.now(),
    todoTime: '08:15',
    timezone: 'Asia/Karachi',
    priority: '3',
    status: 'IN_PROGRESS',
    category: {
      id: 'health',
      name: 'Health',
      color: '#FF5733',
    },
    parentId: null,
    order: 3,
    isCompleted: false,
    hasSubTasks: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    deletedAt: null,
  },
  {
    id: 'todo-4',
    title: 'Buy Grocery',
    description: 'Milk, eggs, bread',
    dueDate: Date.now(),
    todoTime: '20:00',
    timezone: 'Asia/Karachi',
    priority: '3',
    status: 'PENDING',
    category: {
      id: 'health',
      name: 'Health',
      color: '#FF5733',
    },
    parentId: null,
    order: 4,
    isCompleted: false,
    hasSubTasks: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    deletedAt: null,
  },

  // ✅ COMPLETED (2)
  {
    id: 'todo-5',
    title: 'Morning workout',
    description: '30 min cardio',
    dueDate: Date.now(),
    todoTime: '06:30',
    timezone: 'Asia/Karachi',
    priority: '3',
    status: 'COMPLETED',
    category: {
      id: 'health',
      name: 'Health',
      color: '#FF5733',
    },
    parentId: null,
    order: 5,
    isCompleted: true,
    hasSubTasks: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: Date.now(),
    deletedAt: null,
  },
  {
    id: 'todo-6',
    title: 'Reply to emails',
    description: 'Clear inbox',
    dueDate: Date.now(),
    todoTime: '09:00',
    timezone: 'Asia/Karachi',
    priority: '3',
    status: 'COMPLETED',
    category: {
      id: 'health',
      name: 'Health',
      color: '#FF5733',
    },
    parentId: null,
    order: 6,
    isCompleted: true,
    hasSubTasks: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: Date.now(),
    deletedAt: null,
  },
];
todos = [];
export const HomeScreen = (props: ScreenProps<'HomeScreen'>) => {
  const styles = useStyles();

  const RenderTodosList = (
    <FlatList
      data={todos}
      style={{ marginTop: Layout.heightPercentageToDP(2) }}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.todoItem}>
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
        </View>
      )}
    />
  );

  const RenderEmptySection = (
    <View style={styles.notItemsSectionContainer}>
      <CustomImage
        uri={undefined}
        imageStyles={styles.emptyListImage}
        placeHolder={Images.HomeGraphics}
        resizeMode="cover"
      />
      <AppText style={styles.emptyListLabelHeading}>
        <FormattedMessage
          id={LocaleProvider.IDs.label.whatDoYouWantToDoToday}
        />
      </AppText>
      <AppText style={styles.emptyListLabelDescription}>
        <FormattedMessage id={LocaleProvider.IDs.label.tapToAddYourTasks} />
      </AppText>
    </View>
  );

  return (
    <Container
      insetsToHandle={['left', 'right']}
      screenBackgroundStyle={{ flex: 1 }}
      containerStyles={{ flex: 1 }}
    >
      <HomeHeader
        title={LocaleProvider.formatMessage(LocaleProvider.IDs.label.index)}
      />
      <View style={styles.container}>
        <Conditional
          ifTrue={todos?.length > 0}
          elseChildren={RenderEmptySection}
        >
          {RenderTodosList}
        </Conditional>
      </View>
    </Container>
  );
};
