import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: Layout.heightPercentageToDP(4),
  },
  section: {
    paddingHorizontal: Layout.widthPercentageToDP(5),
    paddingVertical: Layout.heightPercentageToDP(3),
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: Layout.heightPercentageToDP(4),
  },
  avatarContainer: {
    width: Layout.widthPercentageToDP(25),
    height: Layout.widthPercentageToDP(25),
    borderRadius: Layout.widthPercentageToDP(12.5),
    backgroundColor: theme.colors.surface.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: theme.colors.brand.DEFAULT,
    marginBottom: Layout.heightPercentageToDP(2),
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: Layout.widthPercentageToDP(10),
    height: Layout.widthPercentageToDP(10),
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.brand.DEFAULT,
    width: Layout.widthPercentageToDP(9),
    height: Layout.widthPercentageToDP(9),
    borderRadius: Layout.widthPercentageToDP(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  profileName: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(20),
    color: theme.colors.typography.DEFAULT,
    marginBottom: Layout.heightPercentageToDP(0.5),
  },
  profileEmail: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(13),
    color: theme.colors.typography[300],
  },
  sectionHeader: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(12),
    color: theme.colors.typography[300],
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: Layout.heightPercentageToDP(1.5),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface.DEFAULT,
    borderRadius: 12,
    paddingHorizontal: Layout.widthPercentageToDP(4),
    paddingVertical: Layout.heightPercentageToDP(2),
    marginBottom: Layout.heightPercentageToDP(1.5),
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: Layout.widthPercentageToDP(3),
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(15),
    color: theme.colors.typography.DEFAULT,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(12),
    color: theme.colors.typography[300],
  },
  settingChevron: {
    marginLeft: Layout.widthPercentageToDP(2),
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borders[50],
    marginVertical: Layout.heightPercentageToDP(2),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.DEFAULT,
    borderRadius: 12,
    paddingVertical: Layout.heightPercentageToDP(2),
    borderWidth: 1,
    borderColor: theme.colors.red,
  },
  logoutText: {
    ...Fonts.latoBold,
    fontSize: Layout.RFValue(15),
    color: theme.colors.red,
    marginLeft: Layout.widthPercentageToDP(2),
  },
}));
