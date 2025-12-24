import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../globals';

export const styles = StyleSheet.create(theme => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.widthPercentageToDP(4),
  },
  container: {
    width: '100%',
    maxWidth: 520,
    maxHeight: Layout.heightPercentageToDP(60),
    backgroundColor: theme.colors.surface['DEFAULT'],
    borderRadius: 8,
    padding: Layout.widthPercentageToDP(5),
    paddingHorizontal: Layout.widthPercentageToDP(3),
    borderWidth: 2,
    borderColor: theme.colors.brand['DEFAULT'],
  },
  heading: {
    ...Fonts.latoBold,
    fontWeight: '700',
    fontSize: Layout.RFValue(16),
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: Layout.heightPercentageToDP(2),
  },
  priorityItemContainer: {
    flex: 1,
    aspectRatio: 1, // makes it square
    borderRadius: 8,
    maxWidth: '21%',
    backgroundColor: theme.colors.surface['50'],
    justifyContent: 'center',
    alignItems: 'center',
  },

  priorityItemSelected: {
    backgroundColor: theme.colors.brand['DEFAULT'],
  },
  priorityItemText: {
    fontSize: Layout.RFValue(16),
    fontWeight: '400',
    ...Fonts.latoRegular,
    color: theme.colors.white,
  },
  columnWrapper: {
    columnGap: Layout.widthPercentageToDP(5),
  },
  listContent: {
    rowGap: Layout.widthPercentageToDP(5),
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.widthPercentageToDP(6),
  },
  cancel: {
    textAlign: 'center',
    color: theme.colors.brand['DEFAULT'],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Layout.widthPercentageToDP(4.5),
    paddingHorizontal: Layout.widthPercentageToDP(3),
  },
  chooseBtn: {
    backgroundColor: theme.colors.brand['DEFAULT'],
    paddingVertical: Layout.widthPercentageToDP(4.5),
    paddingHorizontal: Layout.widthPercentageToDP(3),
    borderRadius: 6,
    flex: 1,
  },
  chooseText: {
    textAlign: 'center',
    color: theme.colors.white,
  },
}));
