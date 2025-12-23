import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  label: {
    ...Fonts.latoRegular,
    fontWeight: '400' as const,
    color: theme.colors.white,
    fontSize: Layout.RFValue(12),
  },
}));
