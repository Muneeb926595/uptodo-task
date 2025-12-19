import React, { useEffect, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Container } from '../../../../../app/components/container';
import { AppText } from '../../../../../app/components/text';
import { ScreenProps } from '../../../../../app/navigation';
import { useStyles } from './styles';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../../../../app/theme';
import { Layout } from '../../../../../app/globals';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import {
  useActiveSession,
  useFocusStats,
  useStartFocus,
  useStopFocus,
  useCancelFocus,
} from '../../../react-query';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/stores';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Mock applications data (would come from device tracking in production)
const applicationsData = [
  {
    name: 'Instagram',
    time: '4h',
    description: 'You spent 4h on Instagram today',
    icon: '📷',
  },
  {
    name: 'Twitter',
    time: '3h',
    description: 'You spent 3h on Twitter today',
    icon: '🐦',
  },
  {
    name: 'Facebook',
    time: '1h',
    description: 'You spent 1h on Facebook today',
    icon: '📘',
  },
  {
    name: 'Telegram',
    time: '30m',
    description: 'You spent 30m on Telegram today',
    icon: '✈️',
  },
  {
    name: 'Gmail',
    time: '45m',
    description: 'You spent 45m on Gmail today',
    icon: '✉️',
  },
];

export const FocusScreen = (props: ScreenProps<'FocusScreen'>) => {
  const styles = useStyles();

  // React Query hooks
  const { data: activeSession, refetch } = useActiveSession();
  const { data: stats } = useFocusStats();
  const startFocus = useStartFocus();
  const stopFocus = useStopFocus();
  const cancelFocus = useCancelFocus();

  // Redux state
  const isActive = useSelector((state: RootState) => state.focus.isActive);

  const progress = useSharedValue(0);

  // Calculate time remaining
  const timeRemaining = useMemo(() => {
    if (!activeSession || !activeSession.endTime) return 0;
    const remaining = Math.max(
      0,
      Math.floor((activeSession.endTime - Date.now()) / 1000),
    );
    return remaining;
  }, [activeSession]);

  // Calculate total time for progress
  const totalTime = activeSession?.duration || 1800;

  // Update progress animation
  useEffect(() => {
    if (activeSession && totalTime > 0) {
      const progressValue = 1 - timeRemaining / totalTime;
      progress.value = withTiming(Math.max(0, Math.min(1, progressValue)), {
        duration: 500,
      });
    } else {
      progress.value = 0;
    }
  }, [timeRemaining, totalTime, activeSession]);

  // Auto-complete session when timer reaches 0
  useEffect(() => {
    if (activeSession && timeRemaining === 0) {
      stopFocus.mutate({ completed: true });
      Alert.alert(
        'Focus Session Complete!',
        'Great job! You completed your focus session.',
      );
    }
  }, [timeRemaining, activeSession]);

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

  const handleStopFocus = () => {
    Alert.alert(
      'Stop Focus Mode?',
      'Are you sure you want to stop your focus session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            cancelFocus.mutate();
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
        <AppText style={styles.screenTitle}>Focus Mode</AppText>

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
              stroke={Colors.surface['50']}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              stroke={Colors.brand['DEFAULT']}
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
          While your focus mode is on, all of your{'\n'}notifications will be
          off
        </AppText>

        <TouchableOpacity
          style={styles.focusButton}
          onPress={activeSession ? handleStopFocus : handleStartFocus}
          activeOpacity={0.8}
          disabled={startFocus.isPending || stopFocus.isPending}
        >
          <AppText style={styles.focusButtonText}>
            {activeSession ? 'Stop Focusing' : 'Start Focusing'}
          </AppText>
        </TouchableOpacity>

        {/* Overview Section */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewHeader}>
            <AppText style={styles.overviewTitle}>Overview</AppText>
            <TouchableOpacity style={styles.weekDropdown}>
              <AppText style={styles.weekDropdownText}>This Week</AppText>
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
                              ? Colors.brand['DEFAULT']
                              : Colors.surface['50'],
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

        {/* Applications Section */}
        <View style={styles.applicationsContainer}>
          <AppText style={styles.applicationsTitle}>Applications</AppText>
          <AppText style={styles.appsSectionNote}>
            App usage tracking coming soon
          </AppText>
          {applicationsData.map((app, index) => (
            <View key={index} style={styles.appItem}>
              <View style={styles.appIconContainer}>
                <AppText style={styles.appIcon}>{app.icon}</AppText>
              </View>
              <View style={styles.appInfo}>
                <AppText style={styles.appName}>{app.name}</AppText>
                <AppText style={styles.appDescription}>
                  {app.description}
                </AppText>
              </View>
              <TouchableOpacity style={styles.appInfoButton}>
                <AppText style={styles.appInfoIcon}>ⓘ</AppText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};
