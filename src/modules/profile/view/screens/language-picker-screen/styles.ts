import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
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
    fontWeight: '600' as const,
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
  languageCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: theme.colors.surface.DEFAULT,
    borderRadius: 16,
    padding: Layout.widthPercentageToDP(4),
    marginBottom: Layout.heightPercentageToDP(2),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageCardSelected: {
    borderColor: theme.colors.brand.DEFAULT,
    backgroundColor: theme.colors.surface['50'],
  },
  languageInfo: {
    flex: 1,
  },
  languageHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  languageFlag: {
    fontSize: Layout.RFValue(32),
    marginRight: Layout.widthPercentageToDP(3),
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: Layout.RFValue(18),
    fontWeight: '600' as const,
    color: theme.colors.white,
    marginBottom: Layout.heightPercentageToDP(0.5),
  },
  languageNativeName: {
    fontSize: Layout.RFValue(14),
    color: theme.colors.typography['300'],
  },
  checkIconContainer: {
    width: Layout.widthPercentageToDP(8),
    height: Layout.widthPercentageToDP(8),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
}));
