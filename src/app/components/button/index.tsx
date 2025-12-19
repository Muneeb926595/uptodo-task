import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import { Props } from './types';
import { AppText } from '../text';
import { Colors } from '../../theme';

export const Button = (props: Props) => {
  const {
    onPress,
    buttonLable,
    buttonContainer,
    btnLabelStyles,
    loading,
    disabled,
    authenticationRequired,
    disableBgColor,
    leftIcon,
    loaderColor,
    rightIcon,
  } = props;

  const renderButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color={loaderColor || Colors.white} />;
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
          backgroundColor: disableBgColor ?? Colors.surface['100'],
        },
      ]}
      disabled={disabled || loading}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};
