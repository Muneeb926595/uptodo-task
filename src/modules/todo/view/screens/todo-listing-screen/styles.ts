import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';
import { Colors } from '../../../../../app/theme';

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
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.surface['100'],
      marginTop: Layout.heightPercentageToDP(1.8),
      marginBottom: Layout.heightPercentageToDP(1.4),
      borderRadius: 4,
      alignSelf: 'flex-start',
      paddingHorizontal: Layout.widthPercentageToDP(2),
      paddingVertical: Layout.heightPercentageToDP(0.6),
    },

    sectionHeaderText: {
      fontSize: Layout.RFValue(12),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
