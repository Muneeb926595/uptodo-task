import React from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
import { HomeHeader } from '../../components';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { Container } from '../../../../../app/components/container';

export const HomeScreen = () => {
  const styles = useStyles();

  return (
    <Container
      insetsToHandle={['left', 'right']}
      screenBackgroundStyle={{ flex: 1 }}
      containerStyles={{ flex: 1 }}
    >
      <HomeHeader
        title={LocaleProvider.formatMessage(LocaleProvider.IDs.label.index)}
      />
      <View style={styles.container}></View>
    </Container>
  );
};
