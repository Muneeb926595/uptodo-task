import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';
import { Colors } from '../../../../../app/theme';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: Colors.modalBackground,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Layout.widthPercentageToDP(4),
    },
    container: {
      width: '100%',
      maxWidth: 520,
      maxHeight: Layout.heightPercentageToDP(60),
      backgroundColor: Colors.surface['DEFAULT'],
      borderRadius: 8,
      padding: Layout.widthPercentageToDP(5),
      paddingHorizontal: Layout.widthPercentageToDP(3),
      borderWidth: 2,
      borderColor: Colors.brand['DEFAULT'],
    },
    heading: {
      ...Fonts.latoBold,
      fontWeight: '700',
      fontSize: Layout.RFValue(16),
      color: tokens.colors.white,
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
      color: Colors.white,
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
      backgroundColor: Colors.brand['DEFAULT'],
      paddingVertical: Layout.widthPercentageToDP(4.5),
      paddingHorizontal: Layout.widthPercentageToDP(3),
      borderRadius: 6,
      flex: 1,
    },
    chooseText: {
      textAlign: 'center',
      color: Colors.white,
    },
  }),
);
