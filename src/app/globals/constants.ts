import { Colors } from '../theme';
import { Layout } from './layout';

class _Constants {
  /**
   * Durations in millisecs
   */
  readonly duration = {
    extraShort: 250,
    short: 500,
    medium: 1000,
    long: 2000,
    extraLong: 6000,
  };

  readonly delimeters = {
    comma: ',',
    space: ' ',
    colon: ':',
  };

  readonly regex = {
    REGEX_SHORT_NAME: /^[A-Za-z0-9-]{1,}$/,
    REGEX_LONG_NAME:
      /^\s*[A-Za-z]['\-,.]*[^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>,:[\]\s]*[A-Za-z]\s*$/,
    REGEX_USA_CELL_NUMBER: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
    REGEX_CHECK_EMPTY_STRING: /^(?!\s*$).+/,
    // updated to atleast 1 alpha, 1 numeric, min 6 char length, special char optional
    REGEX_PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!-\/:-@\[-`{-~\s]{6,}$/,
    REGEX_SIX_DIGIT_CODE: /([0-9]|[a-z]){6}/i,
    REGEX_PHONE_NUMBER: /^[0-9()\s]{1,}$/,
    REGEX_OTP: /^\d{6}$/,
  };

  readonly REGEX_EMAIL = {
    production: /^\s*\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z0-9\-]{2,})+\s*$/,
    other: /^\s*\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z0-9\-]{2,})+\s*$/,
  };

  readonly MAX_LENGTH_PHONE_NUMBER = {
    production: 15,
    other: 20,
  };

  readonly Delays = {
    DEBOUNCE_DELAY: 400,
    MAX_TIME_ALLOW_TO_RESEND_OTP: 120, //in sconds
  };

  readonly Thresholds = {
    NEARBY_DISTANCE_THRESHOLD_METERS: 48280, // 30 miles
  };

  // skeleton related
  readonly skeletons = {
    DEFAULT_SKELTON_SPEED: 800,
    DEFAULT_SKELTON_DIRECTION: 'right',
    DEFAULT_SKELTON_BACKGROUND_COLOR: Colors.white,
  };

  readonly biometric = {
    LAST_USER_LOGIN_PIN: 'LAST_USER_LOGIN_PIN',
    BIOMETRIC_AUTHENTICATION_ENABLED: 'BIOMETRIC_AUTHENTICATION_ENABLED',
    BIOMETRIC_USER_LOGIN_CREDENTIALS: 'BIOMETRIC_USER_LOGIN_CREDENTIALS',
    BIOMETRIC_DATA_SIGNED_BY_RSA_SIGNATURE: 'Enable Biometric',
    BIOMETRIC_MAX_ALLOWED_FAIL_ATTEMPTS: 1,
    BIOMETRIC_HELPER_DIALOG_CLOSE_DELAY: 1000,
  };

  readonly PermissionStatus = {
    granted: 'granted',
  };

  readonly defaults = {
    MANDATORY_SYMBOL: '*',
    DEFAULT_APP_CURRENCY_SYMBOL: '$',
    DEFAULT_APP_LOCALE: 'en-US',
    DEFAULT_APP_CURRENCY: 'USD',
    DEFAULT_CHATBOT_RESPONSE_DELAY: 500,
    DEFAULT_CRYPTO_RANDOM_BYTE_COUNT: 32,
    DEFAULT_CRYPTO_CTR_COUNTER: 5,
    DEFAULT_APP_PADDING: Layout.widthPercentageToDP(4),
    DEFAULT_TOUCH_HIT_SLOP: { top: 8, bottom: 8, left: 8, right: 8 },
  };
}

export const Constants = new _Constants();
