import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Container } from '../../../../views/components/container';
import { AppText } from '../../../../views/components/text';
import { useTodos } from '../../../../react-query';
import { Todo } from '../../../../types';
import { Conditional } from '../../../../views/components/conditional';
import { CustomImage } from '../../../../views/components/custom-image';
import { Images } from '../../../../globals';
import dayjs from 'dayjs';
import { styles } from './styles';
import { FormattedMessage } from '../../../../services/localisation';
import { LocaleProvider } from '../../../../services/localisation';
import { TodoListItem } from '../components';

type TabType = 'today' | 'completed';

// Generate week days starting from a specific date
const generateWeekDays = (startDate: dayjs.Dayjs) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(startDate.add(i, 'day'));
  }
  return days;
};

export const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf('week'),
  );

  const { data: todos } = useTodos();

  const weekDays = useMemo(
    () => generateWeekDays(currentWeekStart),
    [currentWeekStart],
  );

  // Check if a date has todos
  const hasTasksOnDate = (date: dayjs.Dayjs) => {
    return (todos as Todo[])?.some?.(
      todo => todo?.dueDate && dayjs(todo.dueDate).isSame(date, 'day'),
    );
  };

  const filteredTodos = useMemo(() => {
    return (todos as Todo[])?.filter?.(todo => {
      const isDueDateMatch =
        todo?.dueDate && dayjs(todo?.dueDate)?.isSame?.(selectedDate, 'day');

      if (activeTab === 'today') {
        return !todo?.isCompleted && isDueDateMatch;
      } else {
        return todo?.isCompleted && isDueDateMatch;
      }
    });
  }, [todos, selectedDate, activeTab]);

  const goToPreviousWeek = () => {
    setCurrentWeekStart(currentWeekStart.subtract(7, 'day'));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.add(7, 'day'));
  };

  const handleDayPress = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  const RenderEmptySection = (
    <View style={styles.emptyListContainer}>
      <CustomImage
        uri={undefined}
        imageStyles={styles.emptyListImage}
        placeHolder={Images.HomeGraphics}
        resizeMode="cover"
      />
      <AppText style={styles.emptyListLabelHeading}>
        {activeTab === 'today'
          ? LocaleProvider.formatMessage(
              LocaleProvider.IDs.label.noTasksForThisDay,
            )
          : LocaleProvider.formatMessage(
              LocaleProvider.IDs.label.noCompletedTasks,
            )}
      </AppText>
      <AppText style={styles.emptyListLabelDescription}>
        {activeTab === 'today'
          ? LocaleProvider.formatMessage(
              LocaleProvider.IDs.label.tapPlusToAddNewTasks,
            )
          : LocaleProvider.formatMessage(
              LocaleProvider.IDs.label.completeTasksToSeeThemHere,
            )}
      </AppText>
    </View>
  );

  return (
    <Container
      insetsToHandle={['left', 'right', 'top']}
      screenBackgroundStyle={styles.screenBackground}
      containerStyles={styles.containerFlex}
    >
      <View>
        <AppText style={styles.screenTitle}>
          <FormattedMessage id={LocaleProvider.IDs.label.calendar} />
        </AppText>
      </View>
      <View style={styles.container}>
        {/* Header with Month/Year */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goToPreviousWeek} style={styles.arrowBtn}>
            <AppText style={styles.arrow}>‹</AppText>
          </TouchableOpacity>

          <AppText style={styles.header}>
            {currentWeekStart.format('MMMM')}
          </AppText>

          <TouchableOpacity onPress={goToNextWeek} style={styles.arrowBtn}>
            <AppText style={styles.arrow}>›</AppText>
          </TouchableOpacity>
        </View>

        <AppText style={styles.yearText}>
          {currentWeekStart.format('YYYY')}
        </AppText>

        {/* Weekly Calendar */}
        <View style={styles.weekContainer}>
          <View style={styles.weekDaysRow}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
              (day, index) => {
                const isWeekend = index === 0 || index === 6;
                const date = weekDays?.[index];
                const isSelected = date.isSame(selectedDate, 'day');
                const isToday = date.isSame(dayjs(), 'day');
                const hasTasks = hasTasksOnDate(date);

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayColumnContainer,
                      !isSelected && styles.dayColumnUnselected,
                      isSelected && styles.dayColumnSelected,
                    ]}
                    onPress={() => handleDayPress(date)}
                  >
                    <AppText
                      style={[
                        styles.dayLabel,
                        isWeekend && styles.dayLabelWeekend,
                      ]}
                    >
                      {day}
                    </AppText>
                    <AppText
                      style={[
                        styles.dateText,
                        isSelected && styles.dateTextSelected,
                        isToday && !isSelected && styles.dateTextToday,
                      ]}
                    >
                      {date.format('D')}
                    </AppText>
                    {hasTasks && <View style={styles.taskDot} />}
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'today' && styles.tabActive]}
            onPress={() => setActiveTab('today')}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === 'today' && styles.tabTextActive,
              ]}
            >
              Today
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
            onPress={() => setActiveTab('completed')}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === 'completed' && styles.tabTextActive,
              ]}
            >
              <FormattedMessage id={LocaleProvider.IDs.label.completed} />
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Todo List */}
        <View style={styles.listContainer}>
          <Conditional
            ifTrue={(filteredTodos?.length ?? 0) > 0}
            elseChildren={RenderEmptySection}
          >
            <FlatList
              data={filteredTodos}
              renderItem={({ item }) => <TodoListItem item={item} />}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </Conditional>
        </View>
      </View>
    </Container>
  );
};
