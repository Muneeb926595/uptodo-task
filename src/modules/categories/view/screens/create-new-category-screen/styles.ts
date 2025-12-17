import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';
import { Colors } from '../../../../../app/theme';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    header: {
      fontSize: Layout.RFValue(20),
      fontWeight: '700',
      ...Fonts.latoBold,
      color: tokens.colors.white,
    },
    inputlabel: {
      fontSize: Layout.RFValue(14),
      fontWeight: '400',
      ...Fonts.latoRegular,
      color: tokens.colors.white,
      marginBottom: Layout.heightPercentageToDP(1),
      marginTop: Layout.heightPercentageToDP(2.4),
    },
    chooseIconButtonLabel: {
      fontSize: Layout.RFValue(13),
      fontWeight: '400',
      ...Fonts.latoRegular,
      color: tokens.colors.white,
    },
    chooseIconButton: {
      paddingHorizontal: Layout.widthPercentageToDP(3),
      paddingVertical: Layout.heightPercentageToDP(1.4),
      borderRadius: 4,
      backgroundColor: tokens.colors.surface['DEFAULT'],
      alignSelf: 'flex-start',
    },
    colorCircle: {
      width: Layout.widthPercentageToDP(8),
      height: Layout.widthPercentageToDP(8),
      borderRadius: Layout.widthPercentageToDP(5),
      marginRight: Layout.widthPercentageToDP(3),
    },
    actionRow: {
      position: 'absolute',
      bottom: Layout.heightPercentageToDP(2),
      left: Layout.widthPercentageToDP(6),
      right: Layout.widthPercentageToDP(6),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cancel: {
      color: Colors.brand['DEFAULT'],
    },
    chooseBtn: {
      backgroundColor: Colors.brand['DEFAULT'],
      paddingVertical: Layout.heightPercentageToDP(1.7),
      paddingHorizontal: Layout.widthPercentageToDP(4),
      borderRadius: 6,
    },
    chooseText: {
      color: Colors.white,
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
