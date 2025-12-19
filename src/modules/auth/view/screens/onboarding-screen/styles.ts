import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: tokens.colors.background,
    },
    heading: {
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(32),
      color: tokens.colors.typography['DEFAULT'],
      lineHeight: 40,
      marginBottom: Layout.heightPercentageToDP(2),
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
