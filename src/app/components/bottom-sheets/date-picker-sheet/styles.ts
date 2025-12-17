import { StyleSheet } from 'react-native';
import { Fonts, Layout } from '../../../globals';

export const styles = StyleSheet.create({
  sortingItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginBottom: Layout.zero,
    ...Fonts.poppinsRegular,
    fontSize: Layout.RFValue(15),
  },
});
