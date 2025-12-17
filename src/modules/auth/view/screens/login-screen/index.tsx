import React, { useState } from 'react';
import { View } from 'react-native';
import { useLoginMutation } from '../../../store/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/authSlice';
import { useTheme } from '../../../../../app/theme/provider';
import { useStyles } from './styles';

export const LoginScreen = () => {
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

  return <View style={styles.container}></View>;
};
