import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { styles } from './styles';
import { HomeHeader, TodoListItem } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { Conditional } from '../../../../../app/components/conditional';
import { CustomImage } from '../../../../../app/components/custom-image';
import { Images, Layout } from '../../../../../app/globals';
import { AppText } from '../../../../../app/components/text';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { useTheme } from '../../../../../app/theme';
import { Todo } from '../../../types';
import { useTodos } from '../../../react-query';
import { AuthInput } from '../../../../../app/components/inputs';
import {
  TodoSortModal,
  TodoSortOption,
} from '../../components/todo-sort-modal';
import { sortTodos } from '../../../utils/sort-todos';
import { magicModal } from 'react-native-magic-modal';

export const buildTodoListItems = (
  todos: Todo[],
  collapsed: {
    today: boolean;
    completed: boolean;
  },
): any[] => {
  const items: any[] = [];

  const todayTodos = todos?.filter?.(t => !t?.isCompleted && !t?.deletedAt);

  const completedTodos = todos?.filter?.(t => t?.isCompleted && !t?.deletedAt);

  // TODAY
  items.push({
    type: 'header',
    id: 'header-today',
    title: 'Today',
  });

  if (!collapsed.today) {
    todayTodos?.forEach?.(todo =>
      items.push({
        type: 'todo',
        id: todo?.id,
        todo,
      }),
    );
  }

  // COMPLETED
  items.push({
    type: 'header',
    id: 'header-completed',
    title: 'Completed',
  });

  if (!collapsed.completed) {
    completedTodos?.forEach?.(todo =>
      items.push({
        type: 'todo',
        id: todo?.id,
        todo,
      }),
    );
  }

  return items;
};

const SectionHeader = ({
  title,
  isCollapsed,
}: {
  title: string;
  isCollapsed: boolean;
}) => {
  const { theme } = useTheme();
  const rotation = useSharedValue(isCollapsed ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(isCollapsed ? 180 : 0, { duration: 300 });
  }, [isCollapsed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.sectionHeader}>
      <AppText style={styles.sectionHeaderText}>{title}</AppText>
      <Animated.View style={animatedStyle}>
        <AppIcon
          name={AppIconName.arrowDown}
          iconSize={AppIconSize.mini}
          color={theme.colors.white}
          style={{ marginLeft: Layout.widthPercentageToDP(2) }}
        />
      </Animated.View>
    </View>
  );
};

const RenderSectionList = ({
  item,
  setCollapsed,
  collapsed,
}: {
  item: any;
  setCollapsed: (newValues: any) => void;
  collapsed: { today: boolean; completed: boolean };
}) => {
  if (item.type === 'header') {
    const isCollapsed =
      collapsed?.[item?.title?.toLowerCase?.() as 'today' | 'completed'];
    return (
      <TouchableOpacity
        onPress={() =>
          setCollapsed((prev: any) => ({
            ...prev,
            [item.title.toLowerCase()]: !prev[item.title.toLowerCase()],
          }))
        }
      >
        <SectionHeader title={item.title} isCollapsed={isCollapsed} />
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutUp.duration(200)}
    >
      <TodoListItem item={item.todo} />
    </Animated.View>
  );
};

export const TodoListingScreen = () => {
  const { data: todos, refetch } = useTodos();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentSort, setCurrentSort] = useState<TodoSortOption>(
    TodoSortOption.DEFAULT,
  );

  const [collapsed, setCollapsed] = useState({
    today: false,
    completed: false,
  });

  const filteredTodos = useMemo(() => {
    if (!searchText?.trim?.()) return todos;
    const query = searchText?.toLowerCase?.();
    return (todos as Todo[])?.filter?.(
      todo =>
        todo?.title?.toLowerCase?.()?.includes?.(query) ||
        todo?.description?.toLowerCase?.()?.includes?.(query),
    );
  }, [todos, searchText]);

  const sortedTodos = useMemo(() => {
    return sortTodos(filteredTodos as Todo[], currentSort);
  }, [filteredTodos, currentSort]);

  const listItems = useMemo(
    () => buildTodoListItems(sortedTodos as Todo[], collapsed),
    [sortedTodos, collapsed],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleSortChange = (sort: TodoSortOption) => {
    setCurrentSort(sort);
  };

  const handleFilterPress = () => {
    magicModal.show(() => (
      <TodoSortModal
        currentSort={currentSort}
        onSelectSort={handleSortChange}
      />
    ));
  };

  const RenderTodosList = (
    <FlatList
      data={listItems}
      renderItem={({ item }) => (
        <RenderSectionList
          item={item}
          setCollapsed={setCollapsed}
          collapsed={collapsed}
        />
      )}
      keyExtractor={item => item.id}
      removeClippedSubviews
      windowSize={10}
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      refreshControl={refreshing ? <ActivityIndicator /> : undefined}
      onRefresh={handleRefresh}
      refreshing={refreshing}
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
        onFilterPress={handleFilterPress}
      />
      <View style={styles.container}>
        <Conditional
          ifTrue={(todos as Todo[])?.length > 0}
          elseChildren={RenderEmptySection}
        >
          <AuthInput
            value={searchText}
            onChange={setSearchText}
            onBlur={() => {}}
            placeholder={LocaleProvider.formatMessage(
              LocaleProvider.IDs.label.searchForYourTask,
            )}
          />
          {RenderTodosList}
        </Conditional>
      </View>
    </Container>
  );
};
