/**
 * Jest Setup File
 * Runs before all tests to configure the testing environment
 */

// Mock React Native Worklets (required by Reanimated)
jest.mock('react-native-worklets', () => ({
  __esModule: true,
  default: {},
  useWorklet: jest.fn(fn => fn),
  useSharedValue: jest.fn(value => ({ value })),
  createSerializable: jest.fn(fn => fn),
  withReanimatedTimer: jest.fn(fn => fn),
}));

// Mock React Native Reanimated - use simpler approach
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    call: jest.fn(),
    createAnimatedComponent: jest.fn(component => component),
    View: require('react-native').View,
    Text: require('react-native').Text,
    ScrollView: require('react-native').ScrollView,
    Image: require('react-native').Image,
  },
  useSharedValue: jest.fn(value => ({ value })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn(value => value),
  withSpring: jest.fn(value => value),
  withDecay: jest.fn(value => value),
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    bezier: jest.fn(),
  },
}));

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    Swipeable: View,
    GestureHandlerRootView: View,
    PanGestureHandler: View,
  };
});

// Mock MMKV with createMMKV function
jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    contains: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(() => []),
  })),
  MMKV: jest.fn(function () {
    return {
      set: jest.fn(),
      getString: jest.fn(),
      getNumber: jest.fn(),
      getBoolean: jest.fn(),
      contains: jest.fn(),
      remove: jest.fn(),
      clearAll: jest.fn(),
      getAllKeys: jest.fn(() => []),
    };
  }),
}));

// Mock Biometrics with default export and BiometryTypes
jest.mock('react-native-biometrics', () => {
  const mockBiometrics = jest.fn(function () {
    return {
      isSensorAvailable: jest.fn(),
      simplePrompt: jest.fn(),
      createKeys: jest.fn(),
      deleteKeys: jest.fn(),
      biometricKeysExist: jest.fn(),
    };
  });
  return {
    __esModule: true,
    default: mockBiometrics,
    BiometryTypes: {
      FaceID: 'FaceID',
      TouchID: 'TouchID',
      Biometrics: 'Biometrics',
    },
  };
});

// Mock Unistyles to prevent nitro-modules error
jest.mock('react-native-unistyles', () => ({
  StyleSheet: {
    create: styles => styles,
    configure: jest.fn(),
  },
  createStyleSheet: styles => styles,
  UnistylesRegistry: {
    addThemes: jest.fn(),
    addBreakpoints: jest.fn(),
    addConfig: jest.fn(),
  },
  useStyles: jest.fn(() => ({
    styles: {},
    theme: {},
  })),
}));

// Mock Image Picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

// Mock Notifee
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(),
    createTriggerNotification: jest.fn(),
    cancelNotification: jest.fn(),
    cancelAllNotifications: jest.fn(),
    getTriggerNotifications: jest.fn(() => Promise.resolve([])),
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
  },
  TriggerType: {
    TIMESTAMP: 0,
    INTERVAL: 1,
  },
}));

// Mock React Native Compressor
jest.mock('react-native-compressor', () => ({
  Image: {
    compress: jest.fn(),
  },
  Video: {
    compress: jest.fn(),
  },
}));

// Mock Axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    },
  };
});

// Mock React Native File System (RNFS)
jest.mock('react-native-fs', () => ({
  TemporaryDirectoryPath: '/tmp',
  DocumentDirectoryPath: '/documents',
  DownloadDirectoryPath: '/downloads',
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  mkdir: jest.fn(),
  copyFile: jest.fn(),
}));

// Silence console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
