import { StyleSheet } from 'react-native-unistyles';
import { Constants, Fonts, Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    fontWeight: '400' as const,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: Layout.heightPercentageToDP(1.6),
  },
  emptyListLabelDescription: {
    fontSize: Layout.RFValue(16),
    ...Fonts.latoRegular,
    fontWeight: '400' as const,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: Layout.heightPercentageToDP(1.6),
  },
}));
