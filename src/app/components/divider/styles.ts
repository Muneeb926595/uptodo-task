import { StyleSheet } from 'react-native';
import { Layout } from '../../globals';
import { Colors } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    height: Layout.heightPercentageToDP(0.1),
    width: '100%',
    backgroundColor: Colors.borders['DEFAULT'],
  },
});
