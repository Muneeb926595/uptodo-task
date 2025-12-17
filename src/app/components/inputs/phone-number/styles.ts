import _ from 'lodash';
import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../../theme';
import { Fonts, Layout } from '../../../globals';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  countryPickerButtonContainer: {
    marginRight: Layout.widthPercentageToDP(1.4),
    borderWidth: 1,
    borderColor: Colors.surface['DEFAULT'],
    borderRadius: Layout.widthPercentageToDP(1),
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
    marginVertical: Layout.heightPercentageToDP(
      Layout.micro / Layout.divisionFactorForHeight,
    ),
    paddingVertical: Platform.select({
      ios: Layout.heightPercentageToDP(
        Layout.mini / Layout.divisionFactorForHeight,
      ),
      android: Layout.heightPercentageToDP(
        Layout.small / Layout.divisionFactorForHeight,
      ),
    }),
  },
  countryCode: {
    color: Colors.surface['DEFAULT'],
    ...Fonts.poppinsRegular,
    fontSize: Layout.RFValue(14),
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    marginVertical: Layout.heightPercentageToDP(
      Layout.micro / Layout.divisionFactorForHeight,
    ),
    paddingVertical: Platform.select({
      ios: Layout.heightPercentageToDP(
        Layout.mini / Layout.divisionFactorForHeight,
      ),
      android: 0,
    }),
    borderColor: Colors.surface['DEFAULT'],
    borderRadius: Layout.widthPercentageToDP(1),
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
  },
  countryPickerButton: { flexDirection: 'row', alignItems: 'center' },
});

export const inputTextStyle = (color: string) => ({
  paddingHorizontal: Layout.widthPercentageToDP(1),
  flex: 1,
  ...Fonts.poppinsRegular,
  fontSize: Layout.RFValue(14),
  color: color,
});
