import { StyleSheet } from 'react-native';
import { Fonts, Layout } from '../../globals';
import { Colors } from '../../theme';

export const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: Layout.heightPercentageToDP(
      Layout.medium / Layout.divisionFactorForHeight,
    ),
    width: '100%',
    backgroundColor: Colors.brand['DEFAULT'],
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
    color: Colors.white,
    fontSize: Layout.RFValue(15.5),
    ...Fonts.poppinsBold,
  },
});
