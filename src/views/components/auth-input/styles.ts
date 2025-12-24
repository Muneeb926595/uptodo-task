import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../globals';

export const styles = StyleSheet.create(theme => ({
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
    color: theme.colors.white,
    backgroundColor: theme.colors.surface['300'],
    paddingVertical: Layout.heightPercentageToDP(
      (Platform.select({ ios: Layout.small, android: Layout.mini }) ?? 1) /
        Layout.divisionFactorForHeight,
    ),
    borderColor: theme.colors.surface['DEFAULT'],
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
}));
