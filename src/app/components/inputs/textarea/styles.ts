import { Platform, StyleSheet } from 'react-native';
import { Fonts, Layout } from '../../../globals';
import { Colors } from '../../../theme';

export const styles = StyleSheet.create({
  textArea: {
    borderRadius: Layout.widthPercentageToDP(1),
    color: Colors.surface['DEFAULT'],
    backgroundColor: Colors.white,
    paddingVertical: Layout.heightPercentageToDP(
      (Platform.select({ ios: Layout.small, android: Layout.mini }) ?? 1) /
        Layout.divisionFactorForHeight,
    ),
    borderColor: Colors.borders['DEFAULT'],
    borderWidth: 1,
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.medium / Layout.divisionFactorForWidth,
    ),
    marginVertical: Layout.heightPercentageToDP(
      Layout.micro / Layout.divisionFactorForHeight,
    ),
    ...Fonts.poppinsRegular,
    fontSize: Layout.RFValue(14),
    height: Layout.heightPercentageToDP(14),
    textAlignVertical: 'top',
    paddingTop: Layout.heightPercentageToDP(1),
  },
});
