import { PressableStateCallbackType, StyleSheet } from 'react-native';

import { Country } from '../inputs/phone-number/types';
import { Fonts, Layout } from '../../globals';
import { Colors } from '../../theme';

export const ITEM_HEIGHT = 48;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  countryCode: {
    ...Fonts.poppinsSemiBold,
    color: Colors.surface['100'],
    marginBottom: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: Layout.heightPercentageToDP(2),
    alignItems: 'center',
    marginHorizontal: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
    justifyContent: 'space-between',
  },
  screenTitle: {
    marginBottom: Layout.heightPercentageToDP(
      Layout.mini / Layout.divisionFactorForHeight,
    ),
    color: Colors.foreground,
    ...Fonts.poppinsBold,
    fontSize: Layout.RFValue(20),
  },
  searchInput: {
    marginHorizontal: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
    ...Fonts.poppinsRegular,
    fontSize: Layout.RFValue(18),
    color: Colors.typography['100'],
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
  },
  countryName: {
    flex: 1,
    paddingRight: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
    marginBottom: 0,
    color: Colors.surface['DEFAULT'],
    ...Fonts.poppinsRegular,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borders['DEFAULT'],
    marginHorizontal: Layout.widthPercentageToDP(
      Layout.small / Layout.divisionFactorForWidth,
    ),
  },
});

export const pressableStyle = (state: PressableStateCallbackType) => ({
  opacity: state.pressed ? 0.5 : 1,
});

export const itemLayout = (
  data: Country[] | null | undefined,
  index: number,
) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});
