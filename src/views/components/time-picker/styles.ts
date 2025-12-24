import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../../globals';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CENTER_OFFSET = Math.floor(VISIBLE_ITEMS / 2);

export const styles = StyleSheet.create(theme => ({
  root: {
    padding: Layout.widthPercentageToDP(4),
  },
  title: {
    textAlign: 'center',
    fontSize: Layout.RFValue(16),
    color: theme.colors.white,
    marginBottom: Layout.widthPercentageToDP(3),
  },
  divider: {
    height: 1,
    backgroundColor: '#ffffff33',
    marginBottom: Layout.widthPercentageToDP(3),
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: Layout.RFValue(22),
    color: theme.colors.white,
  },
  selectionOverlay: {
    position: 'absolute',
    top: ITEM_HEIGHT * CENTER_OFFSET,
    height: ITEM_HEIGHT,
    left: 0,
    right: 0,
    borderRadius: 10,
    backgroundColor: theme.colors.modalBackground,
  },
  colon: {
    fontSize: Layout.RFValue(28),
    color: theme.colors.white,
    marginHorizontal: Layout.widthPercentageToDP(2),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Layout.widthPercentageToDP(5),
  },
  cancel: {
    color: theme.colors.brand['DEFAULT'],
  },
  chooseBtn: {
    backgroundColor: theme.colors.brand['DEFAULT'],
    paddingVertical: Layout.widthPercentageToDP(2.5),
    paddingHorizontal: Layout.widthPercentageToDP(3),
    borderRadius: 6,
  },
  chooseText: {
    color: theme.colors.white,
  },
}));
