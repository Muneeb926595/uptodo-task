import { StyleProp, ViewStyle } from 'react-native';
import { Layout } from '../../globals';

export type Props = {
  name: AppIconName;
  iconSize?: AppIconSize;
  type?: AppIconType;
  style?: StyleProp<ViewStyle>;
  color?: string;
  backgroundColor?: string;
  accessible?: boolean;
};

export enum AppIconName {
  add = 'UpTodo-add',
  announcement = 'UpTodo-announcement',
  arrowDown = 'UpTodo-arrow-down',
  back = 'UpTodo-back',
  calendar = 'UpTodo-calendar',
  clock = 'UpTodo-clock',
  design = 'UpTodo-design',
  edit = 'UpTodo-edit',
  filter = 'UpTodo-filter',
  flag = 'UpTodo-flag',
  grocery = 'UpTodo-grocery',
  heartbeat = 'UpTodo-heartbeat',
  hide = 'UpTodo-hide',
  home = 'UpTodo-home',
  homeTab = 'UpTodo-home-tab',
  image = 'UpTodo-image',
  leftArrow = 'UpTodo-left-arrow',
  movie = 'UpTodo-movie',
  music = 'UpTodo-music',
  plus = 'UpTodo-plus',
  repeat = 'UpTodo-repeat',
  rightArrow = 'UpTodo-right-arrow',
  send = 'UpTodo-send',
  show = 'UpTodo-show',
  sport = 'UpTodo-sport',
  tag = 'UpTodo-tag',
  timer = 'UpTodo-timer',
  trash = 'UpTodo-trash',
  tree = 'UpTodo-tree',
  university = 'UpTodo-university',
  user = 'UpTodo-user',
  work = 'UpTodo-work',
}

export enum AppIconSize {
  tiny = Layout.widthPercentageToDP(
    Layout.icon.size.tiny / Layout.divisionFactorForWidth,
  ),
  micro = Layout.widthPercentageToDP(
    Layout.icon.size.micro / Layout.divisionFactorForWidth,
  ),
  mini = Layout.widthPercentageToDP(
    Layout.icon.size.mini / Layout.divisionFactorForWidth,
  ),
  small = Layout.widthPercentageToDP(
    Layout.icon.size.small / Layout.divisionFactorForWidth,
  ),
  medium = Layout.widthPercentageToDP(
    Layout.icon.size.medium / Layout.divisionFactorForWidth,
  ),
  primary = Layout.widthPercentageToDP(
    Layout.icon.size.large / Layout.divisionFactorForWidth,
  ),
  xlarge = Layout.widthPercentageToDP(
    Layout.icon.size.xlarge / Layout.divisionFactorForWidth,
  ),
  xxlarge = Layout.widthPercentageToDP(
    Layout.icon.size.xxlarge / Layout.divisionFactorForWidth,
  ),
  xxxlarge = Layout.widthPercentageToDP(
    Layout.icon.size.xxxlarge / Layout.divisionFactorForWidth,
  ),
  huge = Layout.widthPercentageToDP(
    Layout.icon.size.huge / Layout.divisionFactorForWidth,
  ),
}

export enum AppIconType {
  primary = 'primary',
  info = 'info',
  action = 'action',
  success = 'success',
  error = 'error',
  pending = 'pending',
  warning = 'warning',
}
