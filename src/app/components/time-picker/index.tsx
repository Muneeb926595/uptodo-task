import React, { useMemo, useRef, forwardRef } from 'react';
import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../theme';
import { styles } from './styles';
import { AppText } from '../text';
import { FormattedMessage } from '../../localisation/locale-formatter';
import { LocaleProvider } from '../../localisation/locale-provider';
import { Form } from 'react-hook-form';
import { Constants } from '../../globals';

type Props = {
  initialDate: Date;
  minuteInterval?: number;
  onCancel: () => void;
  onConfirm: (d: Date) => void;
};

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CENTER_OFFSET = Math.floor(VISIBLE_ITEMS / 2);

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const padData = <T,>(data: T[]) => [
  ...Array(CENTER_OFFSET).fill(null),
  ...data,
  ...Array(CENTER_OFFSET).fill(null),
];

type WheelProps<T> = {
  data: (T | null)[];
  width: number;
  initialIndex: number;
  onChange: (value: T) => void;
};

const Wheel = forwardRef(function Wheel<T>(
  { data, width, initialIndex, onChange }: WheelProps<T>,
  ref: any,
) {
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e?.nativeEvent?.contentOffset?.y / ITEM_HEIGHT);
    const value = data[index];
    if (value != null) onChange(value);
  };

  return (
    <View style={[styles.wheelContainer, { width }]}>
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={initialIndex}
        getItemLayout={(_, i) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * i,
          index: i,
        })}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) =>
          item == null ? (
            <View style={{ height: ITEM_HEIGHT }} />
          ) : (
            <View style={styles.item}>
              <AppText style={styles.itemText}>
                {typeof item === 'number'
                  ? String(item).padStart(2, '0')
                  : String(item)}
              </AppText>
            </View>
          )
        }
      />

      <View pointerEvents="none" style={styles.selectionOverlay} />
    </View>
  );
});

export const TimePicker: React.FC<Props> = ({
  initialDate,
  minuteInterval = 5,
  onCancel,
  onConfirm,
}) => {
  const hour12 = initialDate.getHours() % 12 || 12;
  const minute = initialDate.getMinutes();
  const isAM = initialDate.getHours() < 12;

  const hours = useMemo(() => range(1, 12), []);
  const minutes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i += minuteInterval) arr.push(i);
    return arr;
  }, [minuteInterval]);

  const hoursData = useMemo(() => padData(hours), [hours]);
  const minutesData = useMemo(() => padData(minutes), [minutes]);
  const ampmData = useMemo(() => padData(['AM', 'PM']), []);

  const selectedRef = useRef({
    hour: hour12,
    minute,
    am: isAM,
  });

  const hourWheelRef = useRef<FlatList>(null);
  const minuteWheelRef = useRef<FlatList>(null);
  const ampmWheelRef = useRef<FlatList>(null);

  const getWheelValue = (wheelRef: any, data: any[], fallback: any) => {
    try {
      const scrollY =
        (wheelRef.current as any)?._listRef?._scrollMetrics?.offset || 0;
      const index = Math.round(scrollY / ITEM_HEIGHT);
      return data[index] ?? fallback;
    } catch {
      return fallback;
    }
  };

  const save = () => {
    // Read current scroll positions directly from the wheels
    const hour = getWheelValue(hourWheelRef, hours, selectedRef.current.hour);
    const minute = getWheelValue(
      minuteWheelRef,
      minutes,
      selectedRef.current.minute,
    );
    const ampm = getWheelValue(
      ampmWheelRef,
      ['AM', 'PM'],
      selectedRef.current.am ? 'AM' : 'PM',
    );

    const h = (hour % 12) + (ampm === 'AM' ? 0 : 12);
    const d = new Date(initialDate);
    d.setHours(h, minute, 0, 0);
    console.log('OH my dogd', d);
    onConfirm(d);
  };

  return (
    <View style={styles.root}>
      <AppText style={styles.title}>
        <FormattedMessage id={LocaleProvider.IDs.label.chooseTime} />
      </AppText>
      <View style={styles.divider} />

      <View style={styles.pickerRow}>
        <Wheel
          ref={hourWheelRef}
          data={hoursData}
          width={90}
          initialIndex={hours.indexOf(hour12) + CENTER_OFFSET}
          onChange={v => (selectedRef.current.hour = v as number)}
        />

        <AppText style={styles.colon}>:</AppText>

        <Wheel
          ref={minuteWheelRef}
          data={minutesData}
          width={90}
          initialIndex={minutes.indexOf(minute) + CENTER_OFFSET}
          onChange={v => (selectedRef.current.minute = v as number)}
        />

        <Wheel
          ref={ampmWheelRef}
          data={ampmData}
          width={90}
          initialIndex={(isAM ? 0 : 1) + CENTER_OFFSET}
          onChange={v => (selectedRef.current.am = v === 'AM')}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          hitSlop={Constants.defaults.DEFAULT_TOUCH_HIT_SLOP}
          onPress={onCancel}
        >
          <AppText style={styles.cancel}>
            <FormattedMessage id={LocaleProvider.IDs.general.cancel} />
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} style={styles.chooseBtn}>
          <AppText style={styles.chooseText}>
            <FormattedMessage id={LocaleProvider.IDs.label.chooseTime} />
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
