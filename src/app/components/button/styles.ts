import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../globals';

export const styles = StyleSheet.create(theme => ({
  buttonContainer: {
    marginTop: Layout.heightPercentageToDP(
      Layout.medium / Layout.divisionFactorForHeight,
    ),
    width: '100%',
    backgroundColor: theme.colors.brand.DEFAULT,
    paddingVertical: Layout.heightPercentageToDP(
      Layout.small / Layout.divisionFactorForHeight,
    ),
    borderRadius: Layout.widthPercentageToDP(2),
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  btnLabel: {
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: Layout.RFValue(15.5),
    ...Fonts.latoBold,
  },
}));
