import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
    },
    screenTitle: {
      textAlign: 'center',
      fontWeight: '400',
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(20),
      color: tokens.colors.white,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: tokens.colors.surface['DEFAULT'],
      marginTop: Layout.heightPercentageToDP(2),
    },
    arrowBtn: {
      padding: Layout.widthPercentageToDP(2),
      paddingHorizontal: Layout.widthPercentageToDP(5),
    },
    arrow: {
      fontSize: Layout.RFValue(32),
      color: tokens.colors.white,
      ...Fonts.latoBold,
    },
    header: {
      fontSize: Layout.RFValue(20),
      ...Fonts.latoBold,
      fontWeight: '700',
      color: tokens.colors.white,
      textAlign: 'center',
    },
    yearText: {
      fontSize: Layout.RFValue(14),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      textAlign: 'center',
      backgroundColor: tokens.colors.surface['DEFAULT'],
    },
    weekContainer: {
      backgroundColor: tokens.colors.surface['DEFAULT'],
      padding: Layout.widthPercentageToDP(3),
      marginBottom: Layout.heightPercentageToDP(2),
    },
    weekDaysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dayColumnContainer: {
      width: Layout.widthPercentageToDP(11),
      paddingVertical: Layout.heightPercentageToDP(1.2),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      gap: Layout.heightPercentageToDP(0.5),
    },
    dayColumnUnselected: {
      backgroundColor: tokens.colors.surface['50'],
    },
    dayColumnSelected: {
      backgroundColor: tokens.colors.brand['DEFAULT'],
    },
    dayLabelContainer: {
      width: Layout.widthPercentageToDP(11),
      alignItems: 'center',
    },
    dayLabel: {
      fontSize: Layout.RFValue(10),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
    },
    dayLabelWeekend: {
      color: tokens.colors.red,
    },
    weekDatesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateText: {
      fontSize: Layout.RFValue(16),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
    },
    dateTextSelected: {
      color: tokens.colors.white,
      ...Fonts.latoBold,
      fontWeight: '700',
    },
    dateTextToday: {
      color: tokens.colors.brand['DEFAULT'],
      ...Fonts.latoBold,
      fontWeight: '600',
    },
    taskDot: {
      position: 'absolute',
      bottom: Layout.heightPercentageToDP(1),
      width: Layout.widthPercentageToDP(1),
      height: Layout.widthPercentageToDP(1),
      borderRadius: 2,
      backgroundColor: tokens.colors.brand['DEFAULT'],
    },
    calendarWrapper: {
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: Layout.heightPercentageToDP(2),
    },
    calendar: {
      borderRadius: 8,
      backgroundColor: tokens.colors.surface['DEFAULT'],
    },
    tabsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.surface['100'],
      borderRadius: 8,
      padding: Layout.widthPercentageToDP(1.5),
      marginBottom: Layout.heightPercentageToDP(2),
    },
    tab: {
      flex: 1,
      paddingVertical: Layout.heightPercentageToDP(1.5),
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: {
      backgroundColor: tokens.colors.brand['DEFAULT'],
    },
    tabText: {
      fontSize: Layout.RFValue(14),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
    },
    tabTextActive: {
      color: tokens.colors.white,
      ...Fonts.latoBold,
      fontWeight: '600',
    },
    listContainer: {
      flex: 1,
    },
    listContent: {
      paddingBottom: Layout.heightPercentageToDP(2),
    },
    emptyListContainer: {
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
      marginTop: Layout.heightPercentageToDP(0.8),
    },
  }),
);
