import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../../auth/repository/auth-repository';
import { authKeys } from './keys';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setLoading } from '../../auth/store/authSlice';
import { User } from '../../auth/types';
import { withLoading } from '../../../app/services/reactQuery/mutationHelpers';

type LoginArgs = { email: string; password: string };

export const useLogin = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation<User, any, LoginArgs>({
    mutationFn: (args: LoginArgs) =>
      authRepository.login(args.email, args.password),
    ...withLoading(dispatch, setLoading),
    onSuccess: (user: User) => {
      // update react-query cache + redux state
      qc.setQueryData(authKeys.user(), user);
      dispatch(setUser(user));
    },
    onError: (_: any) => {
      // keep user cleared on error
      dispatch(clearUser());
    },
  });
};

export const useRefreshToken = () => {
  const qc = useQueryClient();
  return useMutation<string, any, void>({
    mutationFn: () => authRepository.refreshToken(),
    onSuccess: () => {
      // could optionally re-fetch user or update auth headers
      qc.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation<void, any, void>({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: authKeys.user() });
      dispatch(clearUser());
    },
  });
};

export default useLogin;
