// https://material.io/design/typography/the-type-system.html#type-scale

import { StyleSheet } from 'react-native';
import { Fonts, Layout } from '../../globals';
import { Colors } from '../../theme';

export const styles = StyleSheet.create({
  button: {
    fontSize: 14,
    letterSpacing: 1.25,
    fontWeight: '500',
  },
  headingWrapper: {
    paddingBottom: Layout.heightPercentageToDP(
      Layout.medium / Layout.divisionFactorForHeight,
    ),
  },
  heading3: {
    ...Fonts.heading3,
    color: Colors.foreground,
  },
  heading4: {
    ...Fonts.heading4,
  },
  heading5: {
    ...Fonts.heading5,
    color: Colors.foreground,
  },
  heading6: {
    fontSize: 20,
    letterSpacing: 0.15,
    fontWeight: '500',
  },
  paragraph: {
    ...Fonts.latoRegular,
    color: Colors.foreground,
  },
  paragraphBold: {
    ...Fonts.paragraphBold,
    color: Colors.foreground,
  },
  paragraphLarge: {
    ...Fonts.paragraphLarge,
    color: Colors.foreground,
  },
  paragraphSmall: {
    ...Fonts.paragraphSmall,
    color: Colors.foreground,
  },
  paragraphTiny: {
    ...Fonts.paragraphTiny,
    color: Colors.foreground,
  },
  paragraphLink: {
    ...Fonts.paragraphLink,
    color: Colors.brand['DEFAULT'],
  },
  paragraphLinkBold: {
    ...Fonts.paragraphLinkBold,
    color: Colors.brand['DEFAULT'],
  },
  textLink: {
    color: Colors.brand['DEFAULT'],
    ...Fonts.bold,
    paddingVertical: Layout.mini,
  },
  micro: {
    ...Fonts.micro,
    color: Colors.foreground,
  },
});

export const StyledTextStyles = styles;
