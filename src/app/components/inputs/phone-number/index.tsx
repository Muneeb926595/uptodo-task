import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';

import { inputTextStyle, styles } from './styles';
import { Props } from './types';
import { AppText } from '../../text';
import { Colors } from '../../../theme';

const PhoneNumberInput = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleTextChanged = (text: string) => {
    props.onTextChanged(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getInputBorderColor = () => {
    return props?.isError
      ? Colors.red
      : isFocused
      ? Colors.brand['DEFAULT']
      : Colors.surface['DEFAULT'];
  };
  const getInputBackgroundColor = () => {
    return props?.isError ? `${Colors.red}20` : Colors.transparent;
  };

  return (
    <View style={[styles.container, props?.containerStyles]}>
      <Pressable
        onPress={props.onCountryCodePress}
        style={[
          styles.countryPickerButtonContainer,
          {
            borderColor: getInputBorderColor(),
            backgroundColor: getInputBackgroundColor(),
          },
        ]}
      >
        <View style={styles.countryPickerButton}>
          <AppText>{props?.countryItem?.flag}</AppText>
          <View style={{ width: 8 }} />
          <AppText style={styles.countryCode}>
            {props?.countryItem?.dialCode}
          </AppText>
        </View>
      </Pressable>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getInputBorderColor(),
            backgroundColor: getInputBackgroundColor(),
          },
        ]}
      >
        <TextInput
          value={props.value}
          onChangeText={handleTextChanged}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={props?.placeholder}
          placeholderTextColor={
            props.value ? Colors.white : Colors.typography['100']
          }
          numberOfLines={1}
          multiline={false}
          style={inputTextStyle(
            props?.isError ? Colors.red : Colors.surface['DEFAULT'],
          )}
          keyboardType="phone-pad"
          returnKeyType="done"
          underlineColorAndroid={'transparent'}
          selectionColor={Colors.brand['DEFAULT']}
        />
      </View>
    </View>
  );
};

export default PhoneNumberInput;
