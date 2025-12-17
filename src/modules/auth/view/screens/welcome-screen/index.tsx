import React, { useState } from 'react';
import { useLoginMutation } from '../../../store/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/authSlice';
import { useTheme } from '../../../../../app/theme/provider';
import { LocaleProvider } from '../../../../../app/localisation/locale-provider';
import { useStyles } from './styles';
import { Image, View } from 'react-native';
import { Images } from '../../../../../app/globals';
import { Text } from 'react-native-gesture-handler';
import { FormattedMessage } from '../../../../../app/localisation/locale-formatter';

export const WelcomeScreen = () => {
  const { colors, mode, setMode } = useTheme();
  const styles = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setUser(user));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* empty spave at the top */}
      <View />

      {/* center content */}
      <View>
        {/* <Image style={styles.logo} source={Images.Logo} /> */}
        <Text>
          <FormattedMessage id={LocaleProvider.IDs.label.tagline} />
        </Text>
        <Text>
          <FormattedMessage id={LocaleProvider.IDs.label.detailedTagline} />
        </Text>
      </View>

      {/* footer */}
      <View style={styles.row}>
        <Text>
          <FormattedMessage
            id={LocaleProvider.IDs.label.alreadyHaveAnAccount}
          />
        </Text>
        <Text>
          <FormattedMessage id={LocaleProvider.IDs.label.login} />
        </Text>
      </View>
    </View>
  );
};
