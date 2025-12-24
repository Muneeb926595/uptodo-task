import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Props } from './types';
import { AppText } from '../text';
import { useUnistyles } from 'react-native-unistyles';

export const Button = (props: Props) => {
  const {
    onPress,
    buttonLable,
    buttonContainer,
    btnLabelStyles,
    loading,
    disabled,
    disableBgColor,
    leftIcon,
    loaderColor,
    rightIcon,
  } = props;

  const { theme } = useUnistyles();

  const renderButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color={loaderColor || theme.colors.white} />;
    }

    return (
      <>
        {leftIcon ? leftIcon : null}
        <AppText style={[styles.btnLabel, btnLabelStyles]}>
          {buttonLable}
        </AppText>
        {rightIcon ? rightIcon : null}
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        onPress();
      }}
      style={[
        styles.buttonContainer,
        buttonContainer,
        disabled && {
          backgroundColor: disableBgColor ?? theme.colors.surface['100'],
        },
      ]}
      disabled={disabled || loading}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};
