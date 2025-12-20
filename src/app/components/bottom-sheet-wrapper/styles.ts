import { StyleSheet } from 'react-native-unistyles';
import { Fonts, Layout } from '../../globals';

export const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface['DEFAULT'],
    borderTopLeftRadius: Layout.widthPercentageToDP(5),
    borderTopRightRadius: Layout.widthPercentageToDP(5),
  },
  wrapper: {
    alignItems: 'flex-start',
    padding: Layout.widthPercentageToDP(6),
  },
  heading: {
    color: theme.colors.white,
    ...Fonts.latoRegular,
    fontWeight: '700',
    fontSize: Layout.RFValue(20),
    marginBottom: Layout.heightPercentageToDP(1),
  },
}));

export const getCommonBottomSheetStyle = () => {
  const { Colors } = require('../../theme');
  return {
    handleStyle: { display: 'none' },
    backgroundStyle: { backgroundColor: Colors.surface['DEFAULT'] },
  };
};

// Lazy initialization
let _commonBottomSheetStyleCache: any = null;
export const CommonBottomSheetStyle = new Proxy({} as any, {
  get: (_, prop) => {
    if (!_commonBottomSheetStyleCache) {
      _commonBottomSheetStyleCache = getCommonBottomSheetStyle();
    }
    return _commonBottomSheetStyleCache[prop as string];
  },
});
