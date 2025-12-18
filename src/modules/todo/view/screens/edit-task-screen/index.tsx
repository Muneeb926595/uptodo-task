import React from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
import { EditTaskHeader, HomeHeader } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';
import { ScreenProps } from '../../../../../app/navigation';
import { Constants } from '../../../../../app/globals';

export const EditTaskScreen = (props: ScreenProps<'EditTaskScreen'>) => {
  const styles = useStyles();

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
      <View style={styles.container}></View>
    </Container>
  );
};
