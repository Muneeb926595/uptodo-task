import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const smallFormFactorMaxHeight = 620;
const iphone13FactorMaxHeight = 844;

export const Layout = {
  divisionFactorForWidth: 4,
  divisionFactorForHeight: 8,
  window: {
    width,
    height,
    bottom: height - height * 0.86,
    top: 100,
  },
  screen: {
    headerHeight: 62,
    controlsHeight: 31,
    isOfSmallFormFactor: height < smallFormFactorMaxHeight,
    minContentHeight: height * 0.92,
  },

  /**
   * Incremental sizes
   * used for margin, padding
   */
  zero: 0,
  tiny: 2,
  micro: 5,
  mini: 10,
  small: 15,
  medium: 20,
  large: 25,
  xlarge: 27,
  xxlarge: 40,
  xxxlarge: 80,

  /**
   * Position of an element
   */
  absolutePosition: 'absolute' as 'absolute',
  relativePosition: 'relative' as 'relative',

  /**
   * Shadow boxes
   */
  shadowBox: {
    lightestShadow: {
      shadowColor: '#cccccc',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 3,
    },
    lightShallow: {
      shadowColor: '#0000000A',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 2,
    },
    shallow: {
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 3,
      shadowOpacity: 0.3,
      elevation: 2,
    },
    lightDropShadow: {
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowRadius: 4,
      shadowOpacity: 0.05,
      elevation: 3,
      marginBottom: 3,
    },
    appDarkShadow: {
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 2,
      shadowOpacity: 0.09,
      elevation: 3,
      marginBottom: 1,
    },
    low: {
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 3,
      shadowOpacity: 0.4,
      elevation: 3,
      marginBottom: 3,
    },
    deep: {
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowRadius: 8,
      shadowOpacity: 0.6,
      elevation: 8,
    },
  },

  icon: {
    size: {
      tiny: 5,
      micro: 10,
      mini: 15,
      small: 20,
      medium: 22,
      large: 26,
      xlarge: 32,
      xxlarge: 50,
      xxxlarge: 64,
      huge: 80,
    },
    microCircle: {
      width: 14,
      height: 14,
      borderRadius: 16,
    },
    miniCircle: {
      width: 25,
      height: 25,
      borderRadius: 30 / 2,
    },
    smallCircle: {
      width: 40,
      height: 40,
      borderRadius: 40 / 2,
    },
    mediumCircle: {
      width: 48,
      height: 48,
      borderRadius: 48 / 2,
    },
    largeCircle: {
      width: 52,
      height: 52,
      borderRadius: 52 / 2,
    },
    xlargeCircle: {
      width: 62,
      height: 62,
      borderRadius: 62 / 2,
    },
    xxlargeCircle: {
      width: 100,
      height: 100,
      borderRadius: 100 / 2,
    },
    hugeCircle: {
      width: 120,
      height: 120,
      borderRadius: 120 / 2,
    },
  },
  image: {
    small: {
      height: 30,
      width: 30,
      borderRadius: 0,
      borderWidth: 0,
    },
    medium: {
      height: 40,
      width: 40,
      borderRadius: 0,
      borderWidth: 0,
    },
  },

  isSmallDevice: width < 375,

  /**
   * Calculate App Responsive Units to make UI responsive on all of (Small And Large) devices
   */

  /**
   * Converts provided width percentage to independent pixel (dp).
   * @param  {string} widthPercent The percentage of screen's width that UI element should cover
   *                               along with the percentage symbol (%).
   * @return {number}              The calculated dp depending on current device's screen width.
   */
  widthPercentageToDP: (widthPercent: number | string) => {
    // Parse string percentage input and convert it to number.
    const elemWidth =
      typeof widthPercent === 'number'
        ? widthPercent
        : parseFloat(widthPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
  },

  /**
   * Converts provided height percentage to independent pixel (dp).
   * @param  {string} heightPercent The percentage of screen's height that UI element should cover
   *                                along with the percentage symbol (%).
   * @return {number}               The calculated dp depending on current device's screen height.
   */
  heightPercentageToDP: (heightPercent: number | string) => {
    // Parse string percentage input and convert it to number.
    const elemHeight =
      typeof heightPercent === 'number'
        ? heightPercent
        : parseFloat(heightPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
  },

  // guideline height for standard 5" device screen is 680
  RFValue: (fontSize: any, standardScreenHeight = iphone13FactorMaxHeight) => {
    const standardLength = width > height ? width : height;
    const offset: any =
      width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

    const deviceHeight =
      isIphoneX() || Platform.OS === 'android'
        ? standardLength - offset
        : standardLength;

    const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
    return Math.round(heightPercent);
  },
  /* 
  Check if an Android device has bottom physical buttons
   */
  hasBottomBar: () => {
    if (Platform.OS === 'android') {
      const { height } = Dimensions.get('window');
      const { height: windowHeight } = Dimensions.get('screen');
      // @ts-ignore
      const hasSoftKeys = windowHeight - height > StatusBar.currentHeight;
      return hasSoftKeys;
    }
    return false;
  },
};
