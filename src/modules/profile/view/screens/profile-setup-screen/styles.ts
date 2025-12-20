import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Layout.widthPercentageToDP(5),
      paddingTop: Layout.heightPercentageToDP(8),
      paddingBottom: Layout.heightPercentageToDP(4),
    },
    header: {
      marginBottom: Layout.heightPercentageToDP(4),
    },
    title: {
      ...Fonts.latoBold,
      fontSize: Layout.RFValue(28),
      color: tokens.colors.typography.DEFAULT,
      marginBottom: Layout.heightPercentageToDP(1),
      textAlign: 'center',
    },
    subtitle: {
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(14),
      color: tokens.colors.typography[300],
      textAlign: 'center',
      lineHeight: 22,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: Layout.heightPercentageToDP(4),
    },
    avatarContainer: {
      width: Layout.widthPercentageToDP(28),
      height: Layout.widthPercentageToDP(28),
      borderRadius: Layout.widthPercentageToDP(14),
      backgroundColor: tokens.colors.surface.DEFAULT,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: tokens.colors.borders[50],
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    avatarPlaceholder: {
      width: Layout.widthPercentageToDP(12),
      height: Layout.widthPercentageToDP(12),
    },
    changeAvatarButton: {
      marginTop: Layout.heightPercentageToDP(2),
      paddingHorizontal: Layout.widthPercentageToDP(6),
      paddingVertical: Layout.heightPercentageToDP(1.2),
      backgroundColor: tokens.colors.brand.DEFAULT,
      borderRadius: 8,
    },
    changeAvatarText: {
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(13),
      color: tokens.colors.white,
    },
    inputSection: {
      marginBottom: Layout.heightPercentageToDP(3),
    },
    label: {
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(14),
      color: tokens.colors.typography.DEFAULT,
      marginBottom: Layout.heightPercentageToDP(1),
    },
    input: {
      ...Fonts.latoRegular,
      backgroundColor: tokens.colors.surface.DEFAULT,
      borderWidth: 1,
      borderColor: tokens.colors.borders[50],
      borderRadius: 8,
      paddingHorizontal: Layout.widthPercentageToDP(4),
      paddingVertical: Layout.heightPercentageToDP(1.8),
      fontSize: Layout.RFValue(15),
      color: tokens.colors.typography.DEFAULT,
    },
    inputFocused: {
      borderColor: tokens.colors.brand.DEFAULT,
    },
    continueButton: {
      backgroundColor: tokens.colors.brand.DEFAULT,
      paddingVertical: Layout.heightPercentageToDP(2),
      borderRadius: 8,
      alignItems: 'center',
      marginTop: Layout.heightPercentageToDP(2),
    },
    continueButtonDisabled: {
      backgroundColor: tokens.colors.surface[100],
    },
    continueButtonText: {
      ...Fonts.latoBold,
      fontSize: Layout.RFValue(16),
      color: tokens.colors.white,
    },
    skipButton: {
      paddingVertical: Layout.heightPercentageToDP(1.5),
      alignItems: 'center',
      marginTop: Layout.heightPercentageToDP(1),
    },
    skipButtonText: {
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(14),
      color: tokens.colors.typography[300],
    },
  }),
);
