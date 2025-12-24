import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../globals';

export default StyleSheet.create(theme => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.widthPercentageToDP(4),
  },
  container: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: theme.colors.surface['DEFAULT'],
    borderRadius: 8,
    padding: Layout.widthPercentageToDP(5),
    borderWidth: 2,
    borderColor: theme.colors.brand['DEFAULT'],
  },
  title: {
    color: theme.colors.typography['DEFAULT'],
    fontSize: Layout.RFValue(18),
    marginBottom: Layout.widthPercentageToDP(2),
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 6,
    backgroundColor: theme.colors.surface['DEFAULT'],
  },
  daySelected: {
    backgroundColor: theme.colors.brand['DEFAULT'],
  },
  dayWrapper: {
    width: Layout.widthPercentageToDP(8),
    height: Layout.widthPercentageToDP(8),
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface['50'],
  },
  dayDisabled: {
    opacity: 0.4,
  },
  dayText: {
    color: theme.colors.typography['DEFAULT'],
  },
  dayTextDisabled: {
    color: theme.colors.typography['100'],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.widthPercentageToDP(3),
  },
  cancel: {
    color: theme.colors.brand['DEFAULT'],
  },
  chooseBtn: {
    backgroundColor: theme.colors.brand['DEFAULT'],
    paddingVertical: Layout.widthPercentageToDP(2.5),
    paddingHorizontal: Layout.widthPercentageToDP(3),
    borderRadius: 6,
  },
  chooseText: {
    color: theme.colors.white,
  },
}));
