import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../globals';

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
  message: {
    ...Fonts.latoRegular,
    fontWeight: '400',
    fontSize: Layout.RFValue(16),
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: Layout.heightPercentageToDP(1),
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
  error: {
    color: theme.colors.red,
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(12),
  },
}));
