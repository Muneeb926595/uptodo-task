import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.widthPercentageToDP(4),
    paddingVertical: Layout.heightPercentageToDP(2),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borders['50'],
  },
  backButton: {
    padding: Layout.widthPercentageToDP(2),
  },
  headerTitle: {
    fontSize: Layout.RFValue(20),
    fontWeight: '600',
    color: theme.colors.white,
  },
  placeholder: {
    width: Layout.widthPercentageToDP(10),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.widthPercentageToDP(4),
  },
  themeCard: {
    backgroundColor: theme.colors.surface.DEFAULT,
    borderRadius: 16,
    padding: Layout.widthPercentageToDP(4),
    marginBottom: Layout.heightPercentageToDP(2),
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeCardSelected: {
    borderColor: theme.colors.brand.DEFAULT,
    backgroundColor: theme.colors.surface['50'],
  },
  themeInfo: {
    flex: 1,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.heightPercentageToDP(0.5),
  },
  themeIcon: {
    fontSize: Layout.RFValue(24),
    marginRight: Layout.widthPercentageToDP(2),
  },
  themeName: {
    fontSize: Layout.RFValue(18),
    fontWeight: '600',
    color: theme.colors.white,
  },
  themeDescription: {
    fontSize: Layout.RFValue(14),
    color: theme.colors.typography['300'],
  },
  selectedBadge: {
    backgroundColor: theme.colors.brand.DEFAULT,
    borderRadius: 20,
    width: Layout.widthPercentageToDP(8),
    height: Layout.widthPercentageToDP(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: Layout.RFValue(16),
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: Layout.heightPercentageToDP(4),
  },
}));
