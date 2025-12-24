import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.typography.DEFAULT,
    marginBottom: Layout.heightPercentageToDP(1),
    textAlign: 'center',
  },
  subtitle: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(14),
    color: theme.colors.typography['300'],
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
    backgroundColor: theme.colors.surface.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.borders['50'],
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
    backgroundColor: theme.colors.brand.DEFAULT,
    borderRadius: 8,
  },
  changeAvatarText: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(13),
    color: theme.colors.white,
  },
  inputSection: {
    marginBottom: Layout.heightPercentageToDP(3),
  },
  label: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(14),
    color: theme.colors.typography.DEFAULT,
    marginBottom: Layout.heightPercentageToDP(1),
  },
  input: {
    ...Fonts.latoRegular,
    backgroundColor: theme.colors.surface.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.borders['50'],
    borderRadius: 8,
    paddingHorizontal: Layout.widthPercentageToDP(4),
    paddingVertical: Layout.heightPercentageToDP(1.8),
    fontSize: Layout.RFValue(15),
    color: theme.colors.typography.DEFAULT,
  },
  inputFocused: {
    borderColor: theme.colors.brand.DEFAULT,
  },
  continueButton: {
    backgroundColor: theme.colors.brand.DEFAULT,
    paddingVertical: Layout.heightPercentageToDP(2),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Layout.heightPercentageToDP(2),
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.surface['100'],
  },
  continueButtonText: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(16),
    color: theme.colors.white,
  },
  skipButton: {
    paddingVertical: Layout.heightPercentageToDP(1.5),
    alignItems: 'center',
    marginTop: Layout.heightPercentageToDP(1),
  },
  skipButtonText: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(14),
    color: theme.colors.typography['300'],
  },
}));
