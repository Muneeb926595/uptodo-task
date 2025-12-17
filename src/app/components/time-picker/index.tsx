import React, { useMemo, useRef } from 'react';
import {
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Colors } from '../../theme';
import { styles } from './styles';
import { AppText } from '../text';
import { FormattedMessage } from '../../localisation/locale-formatter';
import { LocaleProvider } from '../../localisation/locale-provider';
import { Form } from 'react-hook-form';

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

function Wheel<T>({ data, width, initialIndex, onChange }: WheelProps<T>) {
  const ref = useRef<FlatList>(null);

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
                  : item}
              </AppText>
            </View>
          )
        }
      />

      <View pointerEvents="none" style={styles.selectionOverlay} />
    </View>
  );
}

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

  const save = () => {
    const h =
      (selectedRef?.current?.hour % 12) + (selectedRef?.current?.am ? 0 : 12);
    const d = new Date(initialDate);
    d.setHours(h, selectedRef?.current?.minute, 0, 0);
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
          data={hoursData}
          width={90}
          initialIndex={hours.indexOf(hour12) + CENTER_OFFSET}
          onChange={v => (selectedRef.current.hour = v)}
        />

        <AppText style={styles.colon}>:</AppText>

        <Wheel
          data={minutesData}
          width={90}
          initialIndex={minutes.indexOf(minute) + CENTER_OFFSET}
          onChange={v => (selectedRef.current.minute = v)}
        />

        <Wheel
          data={ampmData}
          width={90}
          initialIndex={(isAM ? 0 : 1) + CENTER_OFFSET}
          onChange={v => (selectedRef.current.am = v === 'AM')}
        />
      </View>

      <View style={styles.actionRow}>
        <AppText onPress={onCancel} style={styles.cancel}>
          <FormattedMessage id={LocaleProvider.IDs.general.cancel} />
        </AppText>
        <AppText onPress={save} style={styles.save}>
          <FormattedMessage id={LocaleProvider.IDs.general.save} />
        </AppText>
      </View>
    </View>
  );
};
