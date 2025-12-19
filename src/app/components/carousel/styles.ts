import { StyleSheet } from 'react-native';
import { Layout } from '../../globals';
import { Colors } from '../../theme';
import { themed } from '../../theme/utils';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    dotView: {
      flexDirection: 'row',
      alignSelf: 'center',
    },
    animatedView: {
      height: Layout.widthPercentageToDP(1),
      width: Layout.widthPercentageToDP(8),
      backgroundColor: Colors.white,
      marginHorizontal: Layout.micro,
      borderRadius: 4,
      marginTop: Layout.heightPercentageToDP(3),
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
);
