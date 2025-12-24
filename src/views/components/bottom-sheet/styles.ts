import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.white,
  },
  backdrop: { flex: 1, backgroundColor: 'transparent' },
}));
