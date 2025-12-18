// NOTE: This RTK Query `authApi` is kept for backward compatibility only.
// We are migrating the auth module to TanStack Query hooks (see `react-query/hooks.ts`).
// Prefer `useLogin`, `useRefreshToken`, `useLogout` from react-query.
// here is example how to use these rtk queryes

// const [login, { isLoading }] = useLoginMutation();
// const handleLogin = async () => {
//   try {
//     const user = await login({ email, password }).unwrap();
//     dispatch(setUser(user));
//   } catch (error) {
//     console.error(error);
//   }
// };

import { createApi } from '@reduxjs/toolkit/query/react';
import { User } from '../types';
import { authRepository } from '../repository';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async () => ({ data: {} }), // baseQuery is ignored if using queryFn
  endpoints: builder => ({
    login: builder.mutation<User, { email: string; password: string }>({
      async queryFn(arg) {
        try {
          const user = await authRepository.login(arg.email, arg.password);
          return { data: user };
        } catch (error: any) {
          console.log('error in authApi login:', error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    refreshToken: builder.mutation<string, void>({
      async queryFn() {
        try {
          const token = await authRepository.refreshToken();
          return { data: token };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
    logout: builder.mutation<void, void>({
      async queryFn() {
        try {
          await authRepository.logout();
          return { data: undefined };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error.response?.data || error.message,
            },
          };
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } =
  authApi;
