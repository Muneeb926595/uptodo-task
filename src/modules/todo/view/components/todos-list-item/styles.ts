import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    // Todo list item styles
    todoItem: {
      backgroundColor: tokens.colors.surface['100'],
      marginBottom: Layout.heightPercentageToDP(1.8),
      padding: Layout.heightPercentageToDP(2),
      paddingHorizontal: Layout.widthPercentageToDP(3),
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: Layout.widthPercentageToDP(1),
    },
    todoItemLabel: {
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      fontSize: Layout.RFValue(16),
      marginBottom: Layout.heightPercentageToDP(1.4),
    },
    todoItemTime: {
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      fontSize: Layout.RFValue(14),
    },
    categoryIcon: {
      width: Layout.widthPercentageToDP(4),
      height: Layout.widthPercentageToDP(4),
      marginRight: Layout.widthPercentageToDP(2),
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
    todoItemCategoryContainer: {
      borderRadius: 6,
      paddingVertical: Layout.heightPercentageToDP(1),
      paddingHorizontal: Layout.widthPercentageToDP(3),
      flexDirection: 'row',
      alignItems: 'center',
    },
    todoItemCategoryLabel: {
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      fontSize: Layout.RFValue(12),
    },
    todoItemPriorityContainer: {
      borderWidth: 1,
      borderColor: tokens.colors.brand['DEFAULT'],
      borderRadius: 6,
      paddingVertical: Layout.heightPercentageToDP(1),
      paddingHorizontal: Layout.widthPercentageToDP(3),
      flexDirection: 'row',
      alignItems: 'center',
    },
    todoItemPriorityLabel: {
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      fontSize: Layout.RFValue(12),
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
