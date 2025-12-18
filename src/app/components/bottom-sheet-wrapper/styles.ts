import { StyleSheet } from 'react-native';
import { Colors } from '../../theme';
import { Fonts, Layout } from '../../globals';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface['DEFAULT'],
    borderTopLeftRadius: Layout.widthPercentageToDP(5),
    borderTopRightRadius: Layout.widthPercentageToDP(5),
  },
  wrapper: {
    alignItems: 'flex-start',
    padding: Layout.widthPercentageToDP(6),
  },
  heading: {
    color: Colors.white,
    ...Fonts.latoRegular,
    fontWeight: '700',
    fontSize: Layout.RFValue(20),
    marginBottom: Layout.heightPercentageToDP(1),
  },
});

export const CommonBottomSheetStyle: any = {
  handleStyle: { display: 'none' },
  backgroundStyle: { backgroundColor: Colors.surface['DEFAULT'] },
};
