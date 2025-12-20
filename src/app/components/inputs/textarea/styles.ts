import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../globals';
import { Colors } from '../../../theme';

export const styles = StyleSheet.create(theme => ({
  textArea: {
    borderRadius: Layout.widthPercentageToDP(1),
    color: theme.colors.surface['DEFAULT'],
    backgroundColor: theme.colors.white,
    paddingVertical: Layout.heightPercentageToDP(
      (Platform.select({ ios: Layout.small, android: Layout.mini }) ?? 1) /
        Layout.divisionFactorForHeight,
    ),
    borderColor: theme.colors.borders['DEFAULT'],
    borderWidth: 1,
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.medium / Layout.divisionFactorForWidth,
    ),
    marginVertical: Layout.heightPercentageToDP(
      Layout.micro / Layout.divisionFactorForHeight,
    ),
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(14),
    height: Layout.heightPercentageToDP(14),
    textAlignVertical: 'top',
    paddingTop: Layout.heightPercentageToDP(1),
  },
}));
