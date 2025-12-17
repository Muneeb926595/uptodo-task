import { StyleSheet } from 'react-native';
import { Fonts, Layout } from '../../globals';
import { Colors } from '../../theme';

export const styles = StyleSheet.create({
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
    color: Colors.brand['DEFAULT'],
    textAlign: 'center',
  },
  description: {
    ...Fonts.poppinsRegular,
    fontSize: Layout.RFValue(14),
    color: Colors.typography['DEFAULT'],
  },
  imageContainer: {
    backgroundColor: Colors.white,
  },
  image: {
    width: '80%',
    alignSelf: 'center',
    height: '54%',
    marginVertical: Layout.heightPercentageToDP(5),
  },
});
