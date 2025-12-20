import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.transparent,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerImage: {
    width: Layout.widthPercentageToDP(10),
    height: Layout.widthPercentageToDP(10),
    borderRadius: 100,
  },
  title: {
    fontSize: Layout.RFValue(20),
    ...Fonts.latoRegular,
    fontWeight: '400' as const,
    color: theme.colors.white,
    textAlign: 'center',
  },
}));
