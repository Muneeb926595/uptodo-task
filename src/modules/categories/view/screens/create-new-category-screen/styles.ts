import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: Layout.RFValue(20),
    fontWeight: '700' as const,
    ...Fonts.latoBold,
    color: theme.colors.white,
  },
  inputlabel: {
    fontSize: Layout.RFValue(14),
    fontWeight: '400' as const,
    ...Fonts.latoRegular,
    color: theme.colors.white,
    marginBottom: Layout.heightPercentageToDP(1),
    marginTop: Layout.heightPercentageToDP(2.4),
  },
  chooseIconButtonLabel: {
    fontSize: Layout.RFValue(13),
    fontWeight: '400' as const,
    ...Fonts.latoRegular,
    color: theme.colors.white,
  },
  chooseIconButton: {
    paddingHorizontal: Layout.widthPercentageToDP(3),
    paddingVertical: Layout.heightPercentageToDP(1.4),
    borderRadius: 4,
    backgroundColor: theme.colors.surface.DEFAULT,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedImage: {
    width: Layout.widthPercentageToDP(8),
    height: Layout.widthPercentageToDP(8),
    borderRadius: Layout.widthPercentageToDP(5),
  },
  colorCircle: {
    width: Layout.widthPercentageToDP(8),
    height: Layout.widthPercentageToDP(8),
    borderRadius: Layout.widthPercentageToDP(5),
    marginRight: Layout.widthPercentageToDP(3),
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  actionRow: {
    position: 'absolute',
    bottom: Layout.heightPercentageToDP(2),
    left: Layout.widthPercentageToDP(6),
    right: Layout.widthPercentageToDP(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancel: {
    color: theme.colors.brand.DEFAULT,
  },
  chooseBtn: {
    backgroundColor: theme.colors.brand.DEFAULT,
    paddingVertical: Layout.heightPercentageToDP(1.7),
    paddingHorizontal: Layout.widthPercentageToDP(4),
    borderRadius: 6,
  },
  chooseText: {
    color: theme.colors.white,
  },
}));
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
