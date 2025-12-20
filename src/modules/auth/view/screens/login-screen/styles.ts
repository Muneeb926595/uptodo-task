import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../../app/globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.borders.DEFAULT,
    padding: 8,
    marginBottom: 12,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface.DEFAULT,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lable: {
    ...Fonts.latoRegular,
    fontWeight: '600' as const,
    fontSize: Layout.RFValue(22),
    color: theme.colors.white,
  },
}));
