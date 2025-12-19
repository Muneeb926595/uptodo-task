import React, { useMemo, useState } from 'react';
import { FlatList, SectionList, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { HomeHeader, TodoListItem } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { Conditional } from '../../../../../app/components/conditional';
import { CustomImage } from '../../../../../app/components/custom-image';
import { Images, Layout } from '../../../../../app/globals';
import { AppText } from '../../../../../app/components/text';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';
import { formatTodoDateTime } from '../../../../../app/utils';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';
import { Colors } from '../../../../../app/theme';
import { ScreenProps } from '../../../../../app/navigation';
import { Todo } from '../../../types';
import { useTodos } from '../../../react-query';

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

const SectionHeader = ({ title }: { title: string }) => {
  const styles = useStyles();

  return (
    <View style={styles.sectionHeader}>
      <AppText style={styles.sectionHeaderText}>{title}</AppText>
      <AppIcon
        name={AppIconName.arrowDown}
        iconSize={AppIconSize.mini}
        color={Colors.white}
        style={{ marginLeft: Layout.widthPercentageToDP(2) }}
      />
    </View>
  );
};

const RenderSectionList = ({
  item,
  setCollapsed,
}: {
  item: any;
  setCollapsed: (newValues: any) => void;
}) => {
  if (item.type === 'header') {
    return (
      <TouchableOpacity
        onPress={() =>
          setCollapsed((prev: any) => ({
            ...prev,
            [item.title.toLowerCase()]: !prev[item.title.toLowerCase()],
          }))
        }
      >
        <SectionHeader title={item.title} />
      </TouchableOpacity>
    );
  }

  return <TodoListItem item={item.todo} />;
};

export const TodoListingScreen = (props: ScreenProps<'TodoListingScreen'>) => {
  const styles = useStyles();

  const { data: todos, isLoading } = useTodos();

  const [collapsed, setCollapsed] = useState({
    today: false,
    completed: false,
  });

  const listItems = useMemo(
    () => buildTodoListItems(todos as Todo[], collapsed),
    [todos, collapsed],
  );

  const RenderTodosList = (
    <FlatList
      data={listItems}
      renderItem={({ item }) => (
        <RenderSectionList item={item} setCollapsed={setCollapsed} />
      )}
      keyExtractor={item => item.id}
      removeClippedSubviews
      windowSize={10}
      initialNumToRender={20}
      maxToRenderPerBatch={20}
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
          ifTrue={(todos as Todo[])?.length > 0}
          elseChildren={RenderEmptySection}
        >
          {RenderTodosList}
        </Conditional>
      </View>
    </Container>
  );
};
