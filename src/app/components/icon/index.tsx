import React from 'react';

import { createIconSet } from 'react-native-vector-icons';

import icons from '../../assets/images/app-icons.json';
import { Props, AppIconSize } from './types';
import { iconOptions, styles } from './styles';
import { View } from 'react-native';

const Icon = createIconSet(icons, 'UpTodo', 'UpTodo.ttf');

export const AppIcon = ({
  name,
  iconSize,
  type,
  backgroundColor,
  style,
  color,
}: Props) => {
  const getIconSize = () => {
    if (iconSize && iconSize !== 0) {
      return iconSize;
    } else {
      return AppIconSize.primary;
    }
  };
  return (
    <View
      style={[
        styles.iconPosition,
        style,
        {
          backgroundColor:
            backgroundColor ?? iconOptions[type ?? 0]?.backgroundColor,
        },
      ]}
    >
      <Icon
        name={name}
        size={getIconSize()}
        color={
          color
            ? color
            : type
            ? iconOptions[type].color
            : iconOptions.default.color
        }
      />
    </View>
  );
};
