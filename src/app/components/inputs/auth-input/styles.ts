import { Platform, StyleSheet } from 'react-native';
import { Fonts, Layout } from '../../../globals';
import { Colors } from '../../../theme';

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Layout.widthPercentageToDP(
      Layout.mini / Layout.divisionFactorForWidth,
    ),
    marginVertical: Layout.heightPercentageToDP(
      Layout.micro / Layout.divisionFactorForHeight,
    ),
  },
  input: {
    borderRadius: Layout.widthPercentageToDP(2),
    color: Colors.white,
    backgroundColor: Colors.surface['300'],
    paddingVertical: Layout.heightPercentageToDP(
      (Platform.select({ ios: Layout.small, android: Layout.mini }) ?? 1) /
        Layout.divisionFactorForHeight,
    ),
    borderColor: Colors.surface['DEFAULT'],
    borderWidth: 1,
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.medium / Layout.divisionFactorForWidth,
    ),
    marginVertical: Layout.heightPercentageToDP(
      Layout.micro / Layout.divisionFactorForHeight,
    ),
    ...Fonts.latoRegular,
    textAlignVertical: 'top',
    fontSize: Layout.RFValue(14),
  },
});
