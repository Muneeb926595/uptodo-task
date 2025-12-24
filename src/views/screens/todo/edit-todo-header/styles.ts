import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../globals';

export const styles = StyleSheet.create(theme =>
  ({
    container: {
      backgroundColor: theme.colors.transparent,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconContainer: {
      width: Layout.widthPercentageToDP(10),
      height: Layout.widthPercentageToDP(10),
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Layout.widthPercentageToDP(2),
      backgroundColor: theme.colors.surface['50'],
    },
    title: {
      fontSize: Layout.RFValue(20),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: theme.colors.white,
      textAlign: 'center',
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
