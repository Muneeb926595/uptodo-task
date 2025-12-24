import React from 'react';
import { ColorValue, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import {
  Emphasis,
  ParagraphLinkBoldProps,
  ParagraphLinkProps,
  Props,
  SmallParagraphLinkProps,
} from './types';

// https://material.io/design/color/text-legibility.html#text-backgrounds
const handleEmphasis = (emph?: Emphasis): ColorValue => {
  switch (emph) {
    case 'low':
      return '#00000061'; // 38%
    case 'high':
      return '#000000DE'; // 87%
    case 'medium':
      return '#00000099'; // 60%
    default:
      return '#000000DE';
  }
};

export const AppText: Props = props => {
  const style = StyleSheet.compose(
    [styles.paragraph, { color: handleEmphasis(props.emphasis) }],
    props.style,
  );
  return (
    <Text {...props} allowFontScaling={false} style={style}>
      {props.children}
    </Text>
  );
};

export const ParagraphLinkBold = (props: ParagraphLinkBoldProps) => {
  return (
    <TouchableOpacity onPress={props?.onPress} style={props?.containerStyle}>
      <Text style={[styles.paragraphLinkBold, props?.style]}>
        {props?.title}
      </Text>
    </TouchableOpacity>
  );
};
export const ParagraphLink = (props: ParagraphLinkProps) => {
  return (
    <TouchableOpacity onPress={props?.onPress} style={props?.containerStyle}>
      <Text style={[styles.paragraphLink, props?.style]}>{props?.title}</Text>
    </TouchableOpacity>
  );
};
export const SmallParagraphLink = (props: SmallParagraphLinkProps) => {
  return (
    <Text
      {...props}
      onPress={() => props.onPress()}
      style={[styles.textLink, props.style]}
    />
  );
};
