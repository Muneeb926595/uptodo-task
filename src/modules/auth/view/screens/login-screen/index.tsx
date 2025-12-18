import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useLogin } from '../../../react-query/hooks';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/authSlice';
import { useTheme } from '../../../../../app/theme/provider';
import { useStyles } from './styles';
import { AppText } from '../../../../../app/components/text';
import { Conditional } from '../../../../../app/components/conditional';
import { Colors } from '../../../../../app/theme';

export const LoginScreen = () => {
  const { colors, mode, setMode } = useTheme();
  const styles = useStyles();

  const [email, setEmail] = useState('keven@mailsac.com');
  const [password, setPassword] = useState('Evolo123@');
  const loginMutation = useLogin();
  const login = loginMutation.mutateAsync;
  const isLoading = loginMutation.status === 'pending';
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const user = await login({ email, password });
      // user is already stored in redux by the hook's onSuccess handler, but keep explicit setUser for clarity
      dispatch(setUser(user as any));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Conditional
        ifTrue={!isLoading}
        elseChildren={<ActivityIndicator size={'large'} color={Colors.white} />}
      >
        <TouchableOpacity onPress={handleLogin}>
          <AppText style={styles.lable}>Press Me to Login</AppText>
        </TouchableOpacity>
      </Conditional>
    </View>
  );
};
