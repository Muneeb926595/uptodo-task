import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoItemLabel: {
    ...Fonts.latoRegular,
    fontWeight: '400',
    color: theme.colors.white,
    fontSize: Layout.RFValue(20),
    marginBottom: Layout.heightPercentageToDP(1.4),
  },
  todoItemTime: {
    ...Fonts.latoRegular,
    fontWeight: '400',
    color: theme.colors.white,
    fontSize: Layout.RFValue(14),
  },
  sectionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.heightPercentageToDP(4),
  },
  sectionActionContainer: {
    borderRadius: 8,
    backgroundColor: theme.colors.surface['DEFAULT'],
    paddingVertical: Layout.heightPercentageToDP(1.6),
    paddingHorizontal: Layout.widthPercentageToDP(3),
  },
  sectionLabel: {
    ...Fonts.latoRegular,
    fontWeight: '400',
    color: theme.colors.white,
    fontSize: Layout.RFValue(16),
  },
  sectionActionLabel: {
    ...Fonts.latoRegular,
    fontWeight: '400',
    color: theme.colors.white,
    fontSize: Layout.RFValue(12),
  },
  categoryIcon: {
    width: Layout.widthPercentageToDP(5),
    height: Layout.widthPercentageToDP(5),
    borderRadius: Layout.widthPercentageToDP(1),
  },
}));

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
