import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Layout } from '../../../../../app/globals';
import { lazy } from 'react';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Layout.heightPercentageToDP(3),
    },
    logo: {
      width: Layout.widthPercentageToDP(40),
      height: Layout.heightPercentageToDP(16),
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
