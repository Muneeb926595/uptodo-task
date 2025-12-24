import React, { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Container } from '../../../../views/components/container';
import { AppText } from '../../../../views/components/text';
import { ScreenProps } from '../../../navigation';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../../../theme';
import { Layout } from '../../../../globals';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import {
  useFocusStats,
  useStartFocus,
  useStopFocus,
  useFocusTimer,
} from '../../../../react-query';
import dayjs from 'dayjs';
import { styles } from './styles';
import {
  FormattedMessage,
  LocaleProvider,
} from '../../../../services/localisation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const FocusScreen = () => {
  const { theme } = useTheme();
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = this week, -1 = last week, etc.

  // React Query hooks
  const { data: stats } = useFocusStats(selectedWeek);
  const timer = useFocusTimer();
  const startFocus = useStartFocus();
  const stopFocus = useStopFocus();

  const progress = useSharedValue(0);

  // Extract timer values
  const activeSession = timer?.session;
  const timeRemaining = timer?.remainingSeconds || 0;

  // Update progress animation
  useEffect(() => {
    if (timer && timer.progress >= 0) {
      progress.value = withTiming(Math.max(0, Math.min(1, timer.progress)), {
        duration: 500,
      });
    } else {
      progress.value = 0;
    }
  }, [timer]);

  // Auto-complete session when timer reaches 0
  useEffect(() => {
    if (timer && timeRemaining === 0) {
      stopFocus.mutate({ completed: true });
      Alert.alert(
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.label.focusSessionComplete,
        ),
        LocaleProvider.formatMessage(
          LocaleProvider.IDs.label.focusSessionCompleteMessage,
        ),
      );
    }
  }, [timeRemaining, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (mins > 0) {
      return `${mins}m`;
    }
    return '0m';
  };

  const handleStartFocus = () => {
    const defaultDuration = 1800; // 30 minutes in seconds
    startFocus.mutate(defaultDuration);
  };

  const handleWeekSelect = () => {
    Alert.alert('Select Week', 'Choose a week to view statistics', [
      {
        text: 'This Week',
        onPress: () => setSelectedWeek(0),
      },
      {
        text: 'Last Week',
        onPress: () => setSelectedWeek(-1),
      },
      {
        text: '2 Weeks Ago',
        onPress: () => setSelectedWeek(-2),
      },
      {
        text: '3 Weeks Ago',
        onPress: () => setSelectedWeek(-3),
      },
      {
        text: LocaleProvider.formatMessage(LocaleProvider.IDs.general.cancel),
        style: 'cancel',
      },
    ]);
  };

  const handleStopFocus = () => {
    Alert.alert(
      LocaleProvider.formatMessage(LocaleProvider.IDs.label.stopFocusMode),
      LocaleProvider.formatMessage(
        LocaleProvider.IDs.label.areYourSureYouWantToStop,
      ),
      [
        {
          text: LocaleProvider.formatMessage(LocaleProvider.IDs.general.cancel),
          style: 'cancel',
        },
        {
          text: LocaleProvider.formatMessage(LocaleProvider.IDs.label.stop),
          style: 'destructive',
          onPress: () => {
            stopFocus.mutate({ completed: true });
          },
        },
      ],
    );
  };

  const radius = 110;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  // Prepare weekly data from stats
  const weeklyData = useMemo(() => {
    if (!stats) {
      return [
        { day: 'SUN', hours: 0, label: '0h' },
        { day: 'MON', hours: 0, label: '0h' },
        { day: 'TUE', hours: 0, label: '0h' },
        { day: 'WED', hours: 0, label: '0h' },
        { day: 'THU', hours: 0, label: '0h' },
        { day: 'FRI', hours: 0, label: '0h' },
        { day: 'SAT', hours: 0, label: '0h' },
      ];
    }

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return stats.thisWeek.map((seconds, index) => {
      const hours = seconds / 3600;
      return {
        day: days[index],
        hours,
        label: formatDuration(seconds),
      };
    });
  }, [stats]);

  const maxHours = 6;
  const barMaxHeight = Layout.heightPercentageToDP(15);
  const currentDay = dayjs().day(); // 0 = Sunday, 6 = Saturday

  return (
    <Container
      insetsToHandle={['left', 'right', 'top']}
      screenBackgroundStyle={{ flex: 1 }}
      containerStyles={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AppText style={styles.screenTitle}>
          {LocaleProvider.formatMessage(LocaleProvider.IDs.label.focusMode)}
        </AppText>

        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <Svg
            width={radius * 2 + strokeWidth * 2}
            height={radius * 2 + strokeWidth * 2}
          >
            {/* Background Circle */}
            <Circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              stroke={theme.colors.surface['50']}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              stroke={theme.colors.brand.DEFAULT}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              rotation="-90"
              origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}
            />
          </Svg>
          <View style={styles.timerTextContainer}>
            <AppText style={styles.timerText}>
              {formatTime(timeRemaining)}
            </AppText>
          </View>
        </View>

        <AppText style={styles.descriptionText}>
          <FormattedMessage
            id={
              LocaleProvider.IDs.label
                .notificationWillBeOffWhileYourFocusModeIsOn
            }
          />
        </AppText>

        <TouchableOpacity
          style={styles.focusButton}
          onPress={activeSession ? handleStopFocus : handleStartFocus}
          activeOpacity={0.8}
          disabled={startFocus.isPending || stopFocus.isPending}
        >
          <AppText style={styles.focusButtonText}>
            {activeSession
              ? LocaleProvider.formatMessage(
                  LocaleProvider.IDs.label.stopFocusing,
                )
              : LocaleProvider.formatMessage(
                  LocaleProvider.IDs.label.startFocusing,
                )}
          </AppText>
        </TouchableOpacity>

        {/* Overview Section */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewHeader}>
            <AppText style={styles.overviewTitle}>
              <FormattedMessage id={LocaleProvider.IDs.label.overview} />
            </AppText>
            <TouchableOpacity
              style={styles.weekDropdown}
              onPress={handleWeekSelect}
            >
              <AppText style={styles.weekDropdownText}>
                {selectedWeek === 0 && (
                  <FormattedMessage id={LocaleProvider.IDs.label.thisWeek} />
                )}
                {selectedWeek === -1 && 'Last Week'}
                {selectedWeek === -2 && '2 Weeks Ago'}
                {selectedWeek === -3 && '3 Weeks Ago'}
              </AppText>
              <AppText style={styles.dropdownArrow}>▼</AppText>
            </TouchableOpacity>
          </View>

          {/* Bar Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.yAxisLabels}>
              {[6, 5, 4, 3, 2, 1].map(hour => (
                <AppText key={hour} style={styles.yAxisLabel}>
                  {hour}h
                </AppText>
              ))}
            </View>
            <View style={styles.barsContainer}>
              {weeklyData.map((data, index) => {
                const barHeight = Math.max(
                  2,
                  (data.hours / maxHours) * barMaxHeight,
                );
                const isToday = index === currentDay;

                return (
                  <View key={data.day} style={styles.barWrapper}>
                    <View style={styles.barColumn}>
                      {data.hours > 0 && (
                        <AppText style={styles.barLabel}>{data.label}</AppText>
                      )}
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: isToday
                              ? theme.colors.brand.DEFAULT
                              : theme.colors.surface['50'],
                          },
                        ]}
                      />
                    </View>
                    <AppText
                      style={[
                        styles.dayLabel,
                        (data.day === 'SUN' || data.day === 'SAT') &&
                          styles.weekendLabel,
                      ]}
                    >
                      {data.day}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};
