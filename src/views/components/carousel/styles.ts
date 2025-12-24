import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../../globals';

export const styles = StyleSheet.create(theme => ({
  dotView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  animatedView: {
    height: Layout.widthPercentageToDP(1),
    width: Layout.widthPercentageToDP(8),
    backgroundColor: theme.colors.white,
    marginHorizontal: Layout.micro,
    borderRadius: 4,
    marginTop: Layout.heightPercentageToDP(3),
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
