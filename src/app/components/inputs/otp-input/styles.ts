import { StyleSheet } from 'react-native';

import { OtpError } from './types';
import { Fonts, Layout } from '../../../globals';
import { Colors } from '../../../theme';

const CELL_SIZE = 45;

export const styles = StyleSheet.create({
  subContainer: { alignItems: 'flex-start' },
  input: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
    color: 'transparent',
  },
  cellRaw: {
    flexDirection: 'row',
  },
  cellContainer: { marginHorizontal: Layout.micro },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  cellText: {
    ...Fonts.heading3,
    color: Colors.surface['DEFAULT'],
  },
  cellBorder: {
    width: CELL_SIZE,
    height: 1,
  },
  errorText: {
    color: Colors.red,
    paddingLeft: Layout.micro,
    ...Fonts.latoRegular,
    fontSize: Layout.RFValue(12),
  },
});

export const cellStyle = (err?: OtpError) => ({
  ...styles.cell,
  width: CELL_SIZE,
  height: CELL_SIZE,
  backgroundColor: err ? `${Colors.red}20` : Colors.white,
});

export const cellTextStyle = (err?: OtpError) => [
  styles.cellText,
  err ? { color: Colors.red } : { color: Colors.surface['DEFAULT'] },
];

export const cellBorderStyle = (focused?: boolean, err?: OtpError) => {
  let bgColor = Colors.transparent;
  if (focused) {
    bgColor = Colors.transparent;
  }
  if (err) {
    bgColor = Colors.red;
  }

  return {
    ...styles.cellBorder,
    backgroundColor: bgColor,
    width: CELL_SIZE,
  };
};

export const errContainerStyle = (width: number) => ({
  width,
});
