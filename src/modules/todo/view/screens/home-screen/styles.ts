import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: tokens.colors.background,
    },
    heading: { color: tokens.colors.text, fontSize: 20, marginBottom: 12 },
    input: {
      borderWidth: 1,
      borderColor: (tokens.colors as any).border ?? '#ccc',
      padding: 8,
      marginBottom: 12,
      color: tokens.colors.text,
      backgroundColor: (tokens.colors as any).card ?? '#fff',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    modeText: { color: tokens.colors.text, marginBottom: 8 },
  }),
);

// Note: themed(...) returns a hook/getter function that must be called inside
// a component's render body to receive up-to-date styles when the theme changes.
// Example usage in a component:
//   const styles = useStyles();
// Export the getter here and call it from the component.
