import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../../../globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: Layout.widthPercentageToDP(4),
    paddingBottom: Layout.heightPercentageToDP(3),
    backgroundColor: theme.colors.surface['DEFAULT'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.widthPercentageToDP(5),
    paddingVertical: Layout.heightPercentageToDP(2),
  },
  headerTitle: {
    fontSize: Layout.RFValue(20),
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Layout.widthPercentageToDP(5),
  },
  optionsContainer: {
    paddingHorizontal: Layout.widthPercentageToDP(5),
    paddingTop: Layout.heightPercentageToDP(2),
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.heightPercentageToDP(1.5),
    paddingHorizontal: Layout.widthPercentageToDP(4),
    borderRadius: Layout.RFValue(8),
    marginBottom: Layout.heightPercentageToDP(1),
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.widthPercentageToDP(3),
  },
  optionText: {
    fontSize: Layout.RFValue(16),
  },
}));
