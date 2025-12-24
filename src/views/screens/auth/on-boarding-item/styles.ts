import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../../../globals';

export const styles = StyleSheet.create(theme =>
  ({
    container: {
      width: Layout.window.width,
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: Layout.widthPercentageToDP(
        Layout.medium / Layout.divisionFactorForWidth,
      ),
      marginTop: Layout.heightPercentageToDP(4),
    },
    heading: {
      ...Fonts.bold,
      color: theme.colors.brand['DEFAULT'],
      textAlign: 'center',
    },
    description: {
      ...Fonts.latoRegular,
      fontWeight: '400',
      textAlign: 'center',
      marginTop: Layout.heightPercentageToDP(1.4),
      fontSize: Layout.RFValue(16),
      color: theme.colors.typography['DEFAULT'],
    },
    imageContainer: {
      backgroundColor: theme.colors.background,
    },
    image: {
      width: '80%',
      alignSelf: 'center',
      height: '54%',
      marginVertical: Layout.heightPercentageToDP(5),
    },
  }),
);
