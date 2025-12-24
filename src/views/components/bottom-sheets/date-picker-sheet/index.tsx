import { Dimensions, View } from 'react-native';
import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';

import { BottomSheetWrapper } from '../../bottom-sheet-wrapper';
import { Button } from '../../button';
import { Colors } from '../../../../theme';
import { Layout } from '../../../../globals';
import { LocaleProvider } from '../../../../services/localisation/locale-provider';
import { convertDateStringToObj } from '../../../../utils';

type Props = {
  headerTitle: any;
  maximumDate?: Date;
  minimumDate?: Date;
  setSelectedDates: (values: any) => void;
};
export const DatePickerBottomSheet = ({
  setSelectedDates,
  headerTitle,
  maximumDate,
  minimumDate,
}: Props) => {
  const [value, setValue] = useState<Date | undefined>(new Date());

  const doDateChange = (date?: Date) => {
    setValue(date);
  };

  const getDefaultDOB = () => {
    const defaultDob = new Date();
    defaultDob.setFullYear(defaultDob.getFullYear());
    return defaultDob;
  };

  const handleDone = () => {
    setSelectedDates(convertDateStringToObj(value));
  };
  return (
    <BottomSheetWrapper headerTitle={headerTitle ?? ''}>
      <View
        style={{
          backgroundColor: Colors.white,
          flex: 1,
          borderTopLeftRadius: Layout.widthPercentageToDP(4),
          borderTopRightRadius: Layout.widthPercentageToDP(4),
          paddingVertical: Layout.widthPercentageToDP(4),
        }}
      >
        <DatePicker
          mode="date"
          date={value ?? getDefaultDOB()}
          onDateChange={doDateChange}
          minimumDate={minimumDate}
          theme="light"
          maximumDate={maximumDate}
          style={{ width: Dimensions.get('screen').width }}
        />

        <View style={{ paddingHorizontal: Layout.widthPercentageToDP(4) }}>
          <Button
            buttonLable={LocaleProvider.formatMessage(
              LocaleProvider.IDs.general.done,
            )}
            onPress={handleDone}
            buttonContainer={{ backgroundColor: Colors.black }}
            btnLabelStyles={{ color: Colors.white }}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};
