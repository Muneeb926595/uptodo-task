import { StyleSheet } from 'react-native-unistyles';
import { Layout } from '../../globals';

export const styles = StyleSheet.create(theme => ({
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    paddingHorizontal: Layout.widthPercentageToDP(
      Layout.micro / Layout.divisionFactorForWidth,
    ),
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.transparent,
    zIndex: 1,
  },
  backgroundImageStyle: {
    flex: 1,
  },
}));
