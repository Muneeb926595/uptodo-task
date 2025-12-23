import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Colors } from '../../../theme';
import { Fonts, Layout } from '../../../globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  countryPickerButtonContainer: {
    marginRight: Layout.widthPercentageToDP(1.4),
    borderWidth: 1,
    borderColor: theme.colors.surface['DEFAULT'],
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
    color: theme.colors.surface['DEFAULT'],
    ...Fonts.latoRegular,
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
    borderColor: theme.colors.surface['DEFAULT'],
    borderRadius: Layout.widthPercentageToDP(1),
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
  },
  countryPickerButton: { flexDirection: 'row', alignItems: 'center' },
}));

export const inputTextStyle = (color: string) => ({
  paddingHorizontal: Layout.widthPercentageToDP(1),
  flex: 1,
  ...Fonts.latoRegular,
  fontSize: Layout.RFValue(14),
  color: color,
});
