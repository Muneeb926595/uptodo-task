import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.widthPercentageToDP(8),
  },
  iconContainer: {
    marginBottom: Layout.heightPercentageToDP(4),
  },
  title: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(24),
    color: theme.colors.typography.DEFAULT,
    textAlign: 'center',
    marginBottom: Layout.heightPercentageToDP(1.5),
  },
  subtitle: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(14),
    color: theme.colors.typography[300],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Layout.heightPercentageToDP(4),
  },
  unlockButton: {
    backgroundColor: theme.colors.brand.DEFAULT,
    paddingVertical: Layout.heightPercentageToDP(2),
    paddingHorizontal: Layout.widthPercentageToDP(12),
    borderRadius: 12,
    alignItems: 'center',
    minWidth: Layout.widthPercentageToDP(60),
  },
  unlockButtonText: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(16),
    color: theme.colors.white,
  },
  errorText: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(13),
    color: theme.colors.red,
    textAlign: 'center',
    marginTop: Layout.heightPercentageToDP(2),
  },
}));
