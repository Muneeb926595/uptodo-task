import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../globals';
import { createNeonEffect } from '../../theme/neon-effects';

export const styles = StyleSheet.create(theme => ({
  headerTitle: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(26),
  },
  floatingButton: {
    width: Layout.widthPercentageToDP(16),
    height: Layout.widthPercentageToDP(16),
    borderRadius: 100,
    backgroundColor: theme.colors.brand.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.heightPercentageToDP(4),
    ...createNeonEffect(theme.colors.brand.DEFAULT, 'high'),
  },
}));
