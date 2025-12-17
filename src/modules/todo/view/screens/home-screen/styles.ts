import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
    },
    notItemsSectionContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Layout.heightPercentageToDP(-6),
    },
    emptyListImage: {
      width: Layout.widthPercentageToDP(60),
      height: Layout.widthPercentageToDP(60),
    },
    emptyListLabelHeading: {
      fontSize: Layout.RFValue(20),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      textAlign: 'center',
      marginTop: Layout.heightPercentageToDP(1.6),
    },
    emptyListLabelDescription: {
      fontSize: Layout.RFValue(16),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      textAlign: 'center',
      marginTop: Layout.heightPercentageToDP(1.6),
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
