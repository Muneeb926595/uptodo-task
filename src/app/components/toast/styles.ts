import { StyleSheet } from 'react-native';
import { themed } from '../../theme/utils';
import { Layout } from '../../globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: Layout.heightPercentageToDP(10),
      left: Layout.widthPercentageToDP(5),
      right: Layout.widthPercentageToDP(5),
      backgroundColor: tokens.colors.surface['DEFAULT'],
      borderRadius: 8,
      padding: Layout.heightPercentageToDP(2),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: tokens.colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 9999,
    },
    message: {
      flex: 1,
      color: tokens.colors.typography['DEFAULT'],
      fontSize: Layout.RFValue(14),
      marginRight: Layout.widthPercentageToDP(2),
    },
    actionButton: {
      paddingHorizontal: Layout.widthPercentageToDP(3),
      paddingVertical: Layout.heightPercentageToDP(1),
    },
    actionLabel: {
      color: tokens.colors.brand['DEFAULT'],
      fontSize: Layout.RFValue(14),
      fontWeight: '600',
    },
  }),
);
