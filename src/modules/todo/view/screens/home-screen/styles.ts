import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';
import { Colors } from '../../../../../app/theme';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
    },
    notItemsSectionContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Layout.heightPercentageToDP(-6),
    },
    emptyListImage: {
      width: Layout.widthPercentageToDP(60),
      height: Layout.widthPercentageToDP(60),
    },
    emptyListLabelHeading: {
      fontSize: Layout.RFValue(20),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      textAlign: 'center',
      marginTop: Layout.heightPercentageToDP(1.6),
    },
    emptyListLabelDescription: {
      fontSize: Layout.RFValue(16),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      textAlign: 'center',
      marginTop: Layout.heightPercentageToDP(1.6),
    },

    // Todo list item styles
    todoItem: {
      backgroundColor: tokens.colors.surface['100'],
      marginBottom: Layout.heightPercentageToDP(1.8),
      padding: Layout.heightPercentageToDP(2),
      borderRadius: 4,
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
    categoryIcon: {
      width: Layout.widthPercentageToDP(4),
      height: Layout.widthPercentageToDP(4),
      marginRight: Layout.widthPercentageToDP(2),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.surface['100'],
      marginTop: Layout.heightPercentageToDP(3),
      marginBottom: Layout.heightPercentageToDP(1),
      borderRadius: 4,
      alignSelf: 'flex-start',
      paddingHorizontal: Layout.widthPercentageToDP(2),
      paddingVertical: Layout.heightPercentageToDP(0.6),
    },

    sectionHeaderText: {
      fontSize: Layout.RFValue(12),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
    },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
