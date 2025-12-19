import React from 'react';
import { Touchable, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { EditTaskHeader, HomeHeader } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { ScreenProps } from '../../../../../app/navigation';
import { Constants, Layout } from '../../../../../app/globals';
import CheckBox from '@react-native-community/checkbox';
import { Colors } from '../../../../../app/theme';
import { AppText } from '../../../../../app/components/text';
import { formatTodoDateTime } from '../../../../../app/utils';
import { AppIcon } from '../../../../../app/components/icon';
import {
  AppIconName,
  AppIconSize,
} from '../../../../../app/components/icon/types';

export const EditTaskScreen = (props: ScreenProps<'EditTaskScreen'>) => {
  const styles = useStyles();

  const todo = props.route.params?.todoItem;

  const handleCompleteTask = () => {};

  const handleEditTitle = () => {};
  return (
    <Container
      insetsToHandle={['left', 'right']}
      screenBackgroundStyle={{
        flex: 1,
        paddingHorizontal: Constants.defaults.DEFAULT_APP_PADDING,
      }}
      containerStyles={{ flex: 1 }}
    >
      <EditTaskHeader title="" />
      <View style={styles.container}>
        {/* task title and description */}
        <View
          style={[
            styles.rowBetween,
            { marginTop: Layout.heightPercentageToDP(3) },
          ]}
        >
          <View
            style={[styles.row, { columnGap: Layout.widthPercentageToDP(2) }]}
          >
            <CheckBox
              boxType="circle"
              style={{
                transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              }}
              tintColors={{
                true: Colors.brand['DEFAULT'],
                false: Colors.white,
              }}
              onValueChange={handleCompleteTask}
            />
            <View>
              <AppText style={styles.todoItemLabel}>{todo?.title}</AppText>
              <AppText style={styles.todoItemTime}>{todo?.description}</AppText>
            </View>
          </View>

          <TouchableOpacity onPress={handleEditTitle}>
            <AppIcon
              name={AppIconName.edit}
              color={Colors.white}
              iconSize={AppIconSize.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};
