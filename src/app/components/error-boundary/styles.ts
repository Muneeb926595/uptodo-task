import { StyleSheet } from 'react-native';
import { Layout } from '../../globals';
import { Colors } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.widthPercentageToDP(5),
  },
  title: {
    fontSize: Layout.RFValue(18),
    fontWeight: 'bold',
    marginBottom: Layout.widthPercentageToDP(2.5),
  },
  errorMessage: {
    marginBottom: Layout.widthPercentageToDP(5),
    textAlign: 'center',
    color: Colors.red,
  },
});
