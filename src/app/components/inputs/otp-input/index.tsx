import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { TextInput, View, Text, Platform } from 'react-native';
import { useKeyboard, useLayout } from '@react-native-community/hooks';

import { Props } from './types';
import {
  cellBorderStyle,
  cellStyle,
  cellTextStyle,
  errContainerStyle,
  styles,
} from './styles';
import { AppText } from '../../text';
import { Colors } from '../../../theme';
import { Layout } from '../../../globals';

export const OtpInput = (props: Props) => {
  const [otpValue, setOtpValue] = useState(props.defaultValue ?? '');
  const [errContainerWidth, setErrContainerWidth] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const keyboard = useKeyboard();
  const { onLayout, width } = useLayout();

  useEffect(() => {
    setErrContainerWidth(width);
  }, [width]);

  const generateCells = (): ReactNode[] => {
    const cells: ReactNode[] = [];
    for (let i = 0; i < props?.cellsLength; i++) {
      cells.push(
        <View
          key={i.toString()}
          style={[
            styles.cellContainer,
            {
              backgroundColor: Colors.white,
              borderWidth: 1,
              borderColor: `${Colors.black}20`,
              borderRadius: Layout.widthPercentageToDP(1),
              marginRight: props.cellSpacing && props.cellSpacing,
            },
          ]}
        >
          <View style={cellStyle(props.error)}>
            {otpValue.length > i && (
              <Text style={cellTextStyle(props.error)}>
                {props?.secureInput ? '*' : otpValue.charAt(i)}
              </Text>
            )}
          </View>
          <View style={cellBorderStyle(keyboard.keyboardShown, props.error)} />
        </View>,
      );
    }
    return cells;
  };

  const handleTextChange = (text: string) => {
    setOtpValue(text);
    props.onCodeChanged(text);
  };
  return (
    <View style={styles.subContainer}>
      <View
        onLayout={onLayout}
        style={[styles.cellRaw, props.rowContainerStyles]}
      >
        {generateCells()}
      </View>
      <View style={errContainerStyle(errContainerWidth)}>
        <AppText style={styles.errorText}>{props.error}</AppText>
      </View>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={otpValue}
        autoFocus
        onChangeText={handleTextChange}
        maxLength={props?.cellsLength}
        keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
        returnKeyType="done"
        textContentType="oneTimeCode"
        underlineColorAndroid="transparent"
        selectionColor="transparent"
      />
    </View>
  );
};
