import React, { useState } from 'react';
import {
  KeyboardType,
  ReturnKeyTypeOptions,
  StyleProp,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { styles } from './styles';
import { FieldError } from 'react-hook-form';
import { AppIcon } from '../../icon';
import { AppIconName, AppIconSize } from '../../icon/types';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Colors } from '../../../theme';
import { Layout } from '../../../globals';

type Props = {
  secure?: boolean;
  showPass?: boolean;
  isInputEditable?: boolean;
  isPassword?: boolean;
  placeholder?: string;
  onChange: (value: any) => void;
  handleTogglePassword?: () => void;
  value: string;
  onBlur: any;
  onFocus?: any;
  scrollEnabled?: boolean;
  multiLine?: boolean;
  keyboardType?: KeyboardType;
  numberOfLines?: number;
  isError?: boolean | FieldError;
  customStyles?: StyleProp<ViewStyle>;
  passwordFieldCustomeStyles?: StyleProp<ViewStyle>;
  useBottomSheetTextInput?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  returnKeyType?: ReturnKeyTypeOptions;
};

export const AuthInput = ({
  secure,
  isPassword,
  handleTogglePassword,
  isInputEditable,
  useBottomSheetTextInput,
  multiLine,
  numberOfLines,
  showPass,
  placeholder,
  accessibilityLabel,
  accessibilityHint,
  onChange,
  value,
  keyboardType,
  onBlur,
  onFocus,
  isError,
  scrollEnabled,
  passwordFieldCustomeStyles,
  customStyles,
  returnKeyType,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: Event) => {
    if (typeof onFocus === 'function') {
      onFocus(e);
    }
    setIsFocused(true);
  };

  const handleBlur = (e: Event) => {
    onBlur(e);
    setIsFocused(false);
  };

  const getInputBorderColor = () => {
    return isError
      ? Colors.red
      : isFocused
      ? Colors.white
      : Colors.borders['DEFAULT'];
  };
  const getInputBackgroundColor = () => {
    return isError ? `${Colors.red}20` : Colors.surface['300'];
  };

  const InputComponent = useBottomSheetTextInput
    ? BottomSheetTextInput
    : TextInput;

  const RenderInput = (
    <InputComponent
      value={value}
      onChangeText={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      editable={isInputEditable}
      placeholderTextColor={isError ? Colors.red : Colors.typography['100']}
      placeholder={placeholder}
      multiline={multiLine}
      scrollEnabled={scrollEnabled ?? false}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      style={[
        styles.input,
        {
          borderColor: getInputBorderColor(),
          backgroundColor: isPassword
            ? Colors.transparent
            : getInputBackgroundColor(),
        },
        isPassword
          ? {
              flex: 1,
              borderWidth: 0,
              height: '100%',
              marginVertical: Layout.zero,
            }
          : {},
        customStyles,
      ]}
      secureTextEntry={secure && !showPass}
    />
  );

  return (
    <>
      {isPassword ? (
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: getInputBorderColor(),
              backgroundColor: getInputBackgroundColor(),
              borderWidth: 1,
              borderRadius: Layout.widthPercentageToDP(2),
              marginVertical: Layout.heightPercentageToDP(
                Layout.micro / Layout.divisionFactorForHeight,
              ),
            },
            passwordFieldCustomeStyles,
          ]}
        >
          {RenderInput}
          <TouchableOpacity
            onPress={() => {
              if (typeof handleTogglePassword === 'function') {
                handleTogglePassword();
              }
            }}
            style={{
              paddingRight: Layout.widthPercentageToDP(
                Layout.small / Layout.divisionFactorForWidth,
              ),
            }}
          >
            {showPass ? (
              <AppIcon
                name={AppIconName.show}
                color={Colors.surface['DEFAULT']}
                iconSize={AppIconSize.mini}
              />
            ) : (
              <AppIcon
                name={AppIconName.hide}
                color={Colors.surface['DEFAULT']}
                iconSize={AppIconSize.small}
              />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        RenderInput
      )}
    </>
  );
};
