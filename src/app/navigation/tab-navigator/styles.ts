import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../globals';

export const styles = StyleSheet.create(theme => ({
  headerTitle: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(26),
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.heightPercentageToDP(4),
  },
  floatingButton: {
    width: Layout.widthPercentageToDP(16),
    height: Layout.widthPercentageToDP(16),
    borderRadius: 100,
    backgroundColor: theme.colors.brand.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.brand.DEFAULT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
  },
}));
