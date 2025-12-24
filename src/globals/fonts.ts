import { Layout } from './layout';

// Fonts mapping
// 600 => medium
// 400 => regular

const primaryFont = 'Lato-Regular';

const latoBlack = 'Lato-Black';
const latoBlackItalic = 'Lato-BlackItalic';
const latoBold = 'Lato-Bold';
const latoBoldItalic = 'Lato-BoldItalic';
const latoItalic = 'Lato-Italic';
const latoLight = 'Lato-Light';
const latoLightItalic = 'Lato-LightItalic';
const latoThin = 'Lato-Thin';
const latoThinItalic = 'Lato-ThinItalic';

export const Fonts = {
  latoBlackItalic: {
    fontFamily: latoBlackItalic,
  },
  latoBlack: {
    fontFamily: latoBlack,
  },
  latoBold: {
    fontFamily: latoBold,
  },
  latoRegular: {
    fontFamily: primaryFont,
  },
  latoBoldItalic: {
    fontFamily: latoBoldItalic,
  },
  latoItalic: {
    fontFamily: latoItalic,
  },
  latoLight: {
    fontFamily: latoLight,
  },
  latoLightItalic: {
    fontFamily: latoLightItalic,
  },
  latoThin: {
    fontFamily: latoThin,
  },
  latoThinItalic: {
    fontFamily: latoThinItalic,
  },
  heading3: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(20),
  },
  heading4: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(20),
  },
  heading5: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(18),
  },
  paragraphLarge: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(20),
  },
  paragraphBold: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(16),
  },
  paragraph: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(16),
  },
  paragraphSmall: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(14),
  },
  paragraphTiny: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(12),
  },
  paragraphLink: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(16),
  },
  paragraphLinkBold: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(16),
  },
  bold: {
    fontFamily: `${primaryFont}`,
  },
  micro: {
    fontFamily: `${primaryFont}`,
    fontSize: Layout.RFValue(13),
  },
};
