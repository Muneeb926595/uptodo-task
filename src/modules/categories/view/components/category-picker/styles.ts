import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../app/globals';

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
    backgroundColor: theme.colors.surface.DEFAULT,
    borderRadius: 8,
    padding: Layout.widthPercentageToDP(5),
    paddingHorizontal: Layout.widthPercentageToDP(3),
    borderWidth: 2,
    borderColor: theme.colors.brand.DEFAULT,
  },
  heading: {
    ...Fonts.latoBold,
    fontWeight: '700' as const,
    fontSize: Layout.RFValue(16),
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: Layout.heightPercentageToDP(2),
  },
  categoryimageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: Layout.widthPercentageToDP(4),
    borderRadius: 8,
    marginBottom: Layout.heightPercentageToDP(1),
  },
  categoryIcon: {
    width: Layout.widthPercentageToDP(10),
    height: Layout.widthPercentageToDP(10),
    borderRadius: 100,
  },
  categoryItemContainer: {
    flex: 1,
    borderRadius: 8,
    maxWidth: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: Layout.RFValue(14),
    ...Fonts.latoBlack,
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
  },
  chooseBtn: {
    backgroundColor: theme.colors.brand.DEFAULT,
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
