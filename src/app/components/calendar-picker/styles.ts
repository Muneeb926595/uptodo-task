import { StyleSheet } from 'react-native';
import { Layout } from '../../globals';
import { Colors } from '../../theme';

export default StyleSheet.create({
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
    backgroundColor: Colors.surface['DEFAULT'],
    borderRadius: 8,
    padding: Layout.widthPercentageToDP(5),
    borderWidth: 2,
    borderColor: Colors.brand['DEFAULT'],
  },
  title: {
    color: Colors.typography['DEFAULT'],
    fontSize: Layout.RFValue(18),
    marginBottom: Layout.widthPercentageToDP(2),
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 6,
    backgroundColor: Colors.surface['DEFAULT'],
  },
  daySelected: {
    backgroundColor: Colors.brand['DEFAULT'],
  },
  dayWrapper: {
    width: Layout.widthPercentageToDP(8),
    height: Layout.widthPercentageToDP(8),
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface['50'],
  },
  dayDisabled: {
    opacity: 0.4,
  },
  dayText: {
    color: Colors.typography['DEFAULT'],
  },
  dayTextDisabled: {
    color: Colors.typography['100'],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.widthPercentageToDP(3),
  },
  cancel: {
    color: Colors.brand['DEFAULT'],
  },
  chooseBtn: {
    backgroundColor: Colors.brand['DEFAULT'],
    paddingVertical: Layout.widthPercentageToDP(2.5),
    paddingHorizontal: Layout.widthPercentageToDP(3),
    borderRadius: 6,
  },
  chooseText: {
    color: Colors.white,
  },
});
