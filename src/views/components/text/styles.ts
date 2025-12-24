// https://material.io/design/typography/the-type-system.html#type-scale

import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../globals';

export const styles = StyleSheet.create(theme => ({
  button: {
    fontSize: 14,
    letterSpacing: 1.25,
    fontWeight: '500' as const,
  },
  headingWrapper: {
    paddingBottom: Layout.heightPercentageToDP(
      Layout.medium / Layout.divisionFactorForHeight,
    ),
  },
  heading3: {
    ...Fonts.heading3,
    color: theme.colors.white,
  },
  heading4: {
    ...Fonts.heading4,
  },
  heading5: {
    ...Fonts.heading5,
    color: theme.colors.white,
  },
  heading6: {
    fontSize: 20,
    letterSpacing: 0.15,
    fontWeight: '500' as const,
  },
  paragraph: {
    ...Fonts.latoRegular,
    color: theme.colors.white,
  },
  paragraphBold: {
    ...Fonts.paragraphBold,
    color: theme.colors.white,
  },
  paragraphLarge: {
    ...Fonts.paragraphLarge,
    color: theme.colors.white,
  },
  paragraphSmall: {
    ...Fonts.paragraphSmall,
    color: theme.colors.white,
  },
  paragraphTiny: {
    ...Fonts.paragraphTiny,
    color: theme.colors.white,
  },
  paragraphLink: {
    ...Fonts.paragraphLink,
    color: theme.colors.brand.DEFAULT,
  },
  paragraphLinkBold: {
    ...Fonts.paragraphLinkBold,
    color: theme.colors.brand.DEFAULT,
  },
  textLink: {
    color: theme.colors.brand.DEFAULT,
    ...Fonts.bold,
    paddingVertical: Layout.mini,
  },
  micro: {
    ...Fonts.micro,
    color: theme.colors.white,
  },
}));

export const StyledTextStyles = styles;
