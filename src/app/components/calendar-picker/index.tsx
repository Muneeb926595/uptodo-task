import React, { useCallback, useMemo, useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

import styles from './styles';
import { Colors } from '../../theme';
import { AppText } from '../text';
import { FormattedMessage } from '../../localisation/locale-formatter';
import { LocaleProvider } from '../../localisation/locale-provider';
import { TimePicker } from '../time-picker';

export type CalendarPickerProps = {
  visible: boolean;
  initialDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  minuteInterval?: number;
  onCancel: () => void;
  onConfirm: (d: Date) => void;
};

const CALENDAR_THEME = {
  todayTextColor: Colors.brand['DEFAULT'],
  selectedDayBackgroundColor: Colors.brand['DEFAULT'],
  calendarBackground: Colors.surface['DEFAULT'],
  dotColor: Colors.brand['DEFAULT'],
  monthTextColor: Colors.typography['DEFAULT'],
  arrowColor: Colors.typography['DEFAULT'],
  backgroundColor: Colors.surface['DEFAULT'],
};

const formatISO = (d: Date) => d.toISOString?.()?.split?.('T')?.[0];

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  initialDate = new Date(),
  mode = 'date',
  minuteInterval = 5,
  onCancel,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<Date>(initialDate);
  const [showTime, setShowTime] = useState(mode === 'time');

  const markedDates = useMemo(
    () => ({
      [formatISO(selected)]: {
        selected: true,
        selectedColor: Colors.brand['DEFAULT'],
      },
    }),
    [selected],
  );

  const onDayPress = useCallback(
    (day: any) => {
      // day.dateString => YYYY-MM-DD
      const [y, m, d] = day.dateString?.split?.('-')?.map?.(Number);
      const newDate = new Date(selected);
      newDate.setFullYear(y, m - 1, d);
      setSelected(newDate);
    },
    [selected],
  );

  const openTime = () => setShowTime(true);
  const closeTime = () => setShowTime(false);

  const handleConfirm = (d?: Date) => {
    const finalDate = d ?? selected;
    onConfirm(finalDate);
  };

  const isSameDay = (a: Date, b: any) =>
    a?.getFullYear?.() === b?.year &&
    a?.getMonth?.() === b?.month - 1 &&
    a?.getDate?.() === b?.day;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {!showTime && (
            <>
              <Calendar
                current={formatISO(selected)}
                onDayPress={onDayPress}
                markedDates={markedDates}
                theme={CALENDAR_THEME}
                style={styles.calendar}
                dayComponent={({ date, state }) => {
                  // minimal custom day to make boxes; keep lightweight
                  const isSelected = isSameDay(selected, date);

                  if (!date) return null;
                  return (
                    <TouchableOpacity
                      onPress={() => onDayPress(date)}
                      style={[
                        styles.dayWrapper,
                        state === 'disabled' && styles.dayDisabled,
                        isSelected && styles.daySelected,
                      ]}
                    >
                      <AppText
                        style={
                          state === 'disabled'
                            ? styles.dayTextDisabled
                            : styles.dayText
                        }
                      >
                        {date.day}
                      </AppText>
                    </TouchableOpacity>
                  );
                }}
              />

              <View style={styles.actionRow}>
                <TouchableOpacity onPress={onCancel}>
                  <AppText style={styles.cancel}>
                    <FormattedMessage id={LocaleProvider.IDs.general.cancel} />
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={openTime} style={styles.chooseBtn}>
                  <AppText style={styles.chooseText}>
                    <FormattedMessage
                      id={LocaleProvider.IDs.label.chooseTime}
                    />
                  </AppText>
                </TouchableOpacity>
              </View>
            </>
          )}

          {showTime && (
            <>
              <AppText style={styles.title}>
                <FormattedMessage id={LocaleProvider.IDs.label.chooseTime} />
              </AppText>
              <TimePicker
                initialDate={selected}
                minuteInterval={minuteInterval}
                onCancel={closeTime}
                onConfirm={d => handleConfirm(d)}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
