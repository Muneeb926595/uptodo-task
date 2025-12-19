import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';
import { Colors } from '../../../../../app/theme';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    scrollContent: {
      paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
      paddingBottom: Layout.heightPercentageToDP(3),
    },
    screenTitle: {
      textAlign: 'center',
      fontWeight: '400',
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(20),
      color: tokens.colors.white,
      marginTop: Layout.heightPercentageToDP(2),
      marginBottom: Layout.heightPercentageToDP(3),
    },
    timerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: Layout.heightPercentageToDP(3),
      position: 'relative',
    },
    timerTextContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerText: {
      fontSize: Layout.RFValue(48),
      ...Fonts.latoBold,
      fontWeight: '700',
      color: tokens.colors.white,
    },
    descriptionText: {
      fontSize: Layout.RFValue(16),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      textAlign: 'center',
      marginBottom: Layout.heightPercentageToDP(3),
      lineHeight: Layout.RFValue(22),
    },
    focusButton: {
      backgroundColor: Colors.brand['DEFAULT'],
      paddingVertical: Layout.heightPercentageToDP(1.8),
      paddingHorizontal: Layout.widthPercentageToDP(12),
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: Layout.heightPercentageToDP(4),
    },
    focusButtonText: {
      fontSize: Layout.RFValue(16),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: Colors.white,
    },
    overviewContainer: {
      marginBottom: Layout.heightPercentageToDP(3),
    },
    overviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Layout.heightPercentageToDP(2),
    },
    overviewTitle: {
      fontSize: Layout.RFValue(20),
      ...Fonts.latoBold,
      fontWeight: '700',
      color: tokens.colors.white,
    },
    weekDropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.surface['50'],
      paddingVertical: Layout.heightPercentageToDP(1),
      paddingHorizontal: Layout.widthPercentageToDP(4),
      borderRadius: 6,
      gap: Layout.widthPercentageToDP(2),
    },
    weekDropdownText: {
      fontSize: Layout.RFValue(12),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
    },
    dropdownArrow: {
      fontSize: Layout.RFValue(10),
      color: tokens.colors.white,
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingVertical: Layout.heightPercentageToDP(2),
    },
    yAxisLabels: {
      justifyContent: 'space-between',
      height: Layout.heightPercentageToDP(15),
      marginRight: Layout.widthPercentageToDP(2),
    },
    yAxisLabel: {
      fontSize: Layout.RFValue(10),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
    },
    barsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: Layout.heightPercentageToDP(15),
    },
    barWrapper: {
      flex: 1,
      alignItems: 'center',
      gap: Layout.heightPercentageToDP(0.5),
    },
    barColumn: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
      width: '100%',
    },
    bar: {
      width: '80%',
      borderRadius: 4,
      minHeight: 2,
    },
    barLabel: {
      fontSize: Layout.RFValue(9),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      marginBottom: Layout.heightPercentageToDP(0.5),
    },
    dayLabel: {
      fontSize: Layout.RFValue(10),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      marginTop: Layout.heightPercentageToDP(1),
    },
    weekendLabel: {
      color: Colors.red,
    },
    applicationsContainer: {
      marginBottom: Layout.heightPercentageToDP(2),
    },
    applicationsTitle: {
      fontSize: Layout.RFValue(20),
      ...Fonts.latoBold,
      fontWeight: '700',
      color: tokens.colors.white,
      marginBottom: Layout.heightPercentageToDP(2),
    },
    appsSectionNote: {
      fontSize: Layout.RFValue(12),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      opacity: 0.5,
      marginBottom: Layout.heightPercentageToDP(1.5),
      fontStyle: 'italic',
    },
    appItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.colors.surface['50'],
      borderRadius: 8,
      padding: Layout.widthPercentageToDP(4),
      marginBottom: Layout.heightPercentageToDP(1.5),
    },
    appIconContainer: {
      width: Layout.widthPercentageToDP(12),
      height: Layout.widthPercentageToDP(12),
      borderRadius: 12,
      backgroundColor: tokens.colors.surface['100'],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Layout.widthPercentageToDP(3),
    },
    appIcon: {
      fontSize: Layout.RFValue(24),
    },
    appInfo: {
      flex: 1,
    },
    appName: {
      fontSize: Layout.RFValue(16),
      ...Fonts.latoBold,
      fontWeight: '600',
      color: tokens.colors.white,
      marginBottom: Layout.heightPercentageToDP(0.3),
    },
    appDescription: {
      fontSize: Layout.RFValue(12),
      ...Fonts.latoRegular,
      fontWeight: '400',
      color: tokens.colors.white,
      opacity: 0.7,
    },
    appInfoButton: {
      width: Layout.widthPercentageToDP(8),
      height: Layout.widthPercentageToDP(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    appInfoIcon: {
      fontSize: Layout.RFValue(20),
      color: tokens.colors.white,
      opacity: 0.5,
    },
  }),
);
