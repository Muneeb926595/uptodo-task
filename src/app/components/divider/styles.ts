import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    height: Layout.heightPercentageToDP(0.1),
    width: '100%',
    backgroundColor: theme.colors.borders.DEFAULT,
  },
}));
