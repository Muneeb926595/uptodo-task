// src/app/stores/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../modules/auth/store/authSlice';
import { authApi } from '../../modules/auth/store/authApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
