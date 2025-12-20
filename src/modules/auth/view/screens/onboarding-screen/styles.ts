import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme =>
  ({
    mainContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    heading: {
      ...Fonts.bold,
      fontWeight: '700',
      fontSize: Layout.RFValue(32),
      color: theme.colors.typography['DEFAULT'],
      lineHeight: 40,
      textAlign: 'center',
      marginBottom: Layout.heightPercentageToDP(2),
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
