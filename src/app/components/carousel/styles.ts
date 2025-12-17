import { StyleSheet } from 'react-native';
import { Layout } from '../../globals';
import { Colors } from '../../theme';

export const styles = StyleSheet.create({
  dotView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  animatedView: {
    height: Layout.widthPercentageToDP(2),
    width: Layout.widthPercentageToDP(2.5),
    backgroundColor: Colors.brand['DEFAULT'],
    marginHorizontal: Layout.micro,
    borderRadius: 100,
    marginTop: Layout.heightPercentageToDP(3),
    marginBottom: -Layout.heightPercentageToDP(4),
  },
});
