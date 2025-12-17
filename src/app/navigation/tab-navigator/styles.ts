import { StyleSheet } from 'react-native';
import { Fonts, Layout } from '../../globals';
import { Colors } from '../../theme';

export const styles = StyleSheet.create({
  headerTitle: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(26),
  },
  floatingButton: {
    width: Layout.widthPercentageToDP(16),
    height: Layout.widthPercentageToDP(16),
    borderRadius: 100,
    backgroundColor: Colors.brand['DEFAULT'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.heightPercentageToDP(4),
  },
});
