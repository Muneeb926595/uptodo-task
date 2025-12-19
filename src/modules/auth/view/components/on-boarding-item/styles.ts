import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
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
      color: tokens.colors.brand['DEFAULT'],
      textAlign: 'center',
    },
    description: {
      ...Fonts.latoRegular,
      fontWeight: '400',
      textAlign: 'center',
      marginTop: Layout.heightPercentageToDP(1.4),
      fontSize: Layout.RFValue(16),
      color: tokens.colors.typography['DEFAULT'],
    },
    imageContainer: {
      backgroundColor: tokens.colors.background,
    },
    image: {
      width: '80%',
      alignSelf: 'center',
      height: '54%',
      marginVertical: Layout.heightPercentageToDP(5),
    },
  }),
);
