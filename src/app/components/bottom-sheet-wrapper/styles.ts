import { StyleSheet } from 'react-native';
import { Colors } from '../../theme';
import { Fonts, Layout } from '../../globals';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand['DEFAULT'],
    borderTopLeftRadius: Layout.widthPercentageToDP(5),
    borderTopRightRadius: Layout.widthPercentageToDP(5),
  },
  wrapper: {
    alignItems: 'flex-start',
    padding: Layout.widthPercentageToDP(4),
  },
  backIcon: {
    marginBottom: Layout.heightPercentageToDP(2),
  },
  heading: {
    color: Colors.white,
    ...Fonts.poppinsSemiBold,
    fontSize: Layout.RFValue(18.5),
    marginBottom: Layout.heightPercentageToDP(1.2),
  },
});

export const CommonBottomSheetStyle: any = {
  handleStyle: { display: 'none' },
  backgroundStyle: { backgroundColor: Colors.brand['DEFAULT'] },
};
