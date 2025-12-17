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
    color: Colors.white,
  },
  heading4: {
    ...Fonts.heading4,
  },
  heading5: {
    ...Fonts.heading5,
    color: Colors.white,
  },
  heading6: {
    fontSize: 20,
    letterSpacing: 0.15,
    fontWeight: '500',
  },
  paragraph: {
    ...Fonts.latoRegular,
    color: Colors.white,
  },
  paragraphBold: {
    ...Fonts.paragraphBold,
    color: Colors.white,
  },
  paragraphLarge: {
    ...Fonts.paragraphLarge,
    color: Colors.white,
  },
  paragraphSmall: {
    ...Fonts.paragraphSmall,
    color: Colors.white,
  },
  paragraphTiny: {
    ...Fonts.paragraphTiny,
    color: Colors.white,
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
    color: Colors.white,
  },
});

export const StyledTextStyles = styles;
