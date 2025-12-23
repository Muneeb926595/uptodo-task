module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'react-native-unistyles/plugin',
      {
        // pass root folder of your application
        // all files under this folder will be processed by the Babel plugin
        // if you need to include more folders, or customize discovery process
        // check available babel options
        root: 'src',
      },
    ],
    'hot-updater/babel-plugin',
    'react-native-reanimated/plugin',
  ],
};
