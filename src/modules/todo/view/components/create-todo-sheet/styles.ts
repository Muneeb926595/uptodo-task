import { StyleSheet } from 'react-native';
import { themed } from '../../../../../app/theme/utils';
import { Constants, Fonts, Layout } from '../../../../../app/globals';

export const useStyles = themed(tokens =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
    },
    error: {
      color: tokens.colors.red,
      ...Fonts.latoRegular,
      fontSize: Layout.RFValue(12),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    galleryPicker: {
      alignSelf: 'flex-end',
      width: Layout.widthPercentageToDP(30),
      height: Layout.heightPercentageToDP(8),
      alignItems: 'flex-end',
      marginTop: Layout.heightPercentageToDP(2),
    },
    attachment: {
      height: '100%',
      width: '100%',
      borderRadius: 8,
    },
  }),
);
