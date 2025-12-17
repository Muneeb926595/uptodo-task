import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      backgroundColor: tokens.colors.transparent,
    },
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerImage: {
      width: Layout.widthPercentageToDP(8),
      height: Layout.widthPercentageToDP(8),
      borderRadius: 100,
    },
    title: {
      fontSize: Layout.RFValue(20),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      textAlign: 'center',
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
