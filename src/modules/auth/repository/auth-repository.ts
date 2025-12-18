import StorageHelper, { StorageKeys } from '../../../app/data/mmkv-storage';
import { authApi } from '../api/auth.api';
import { User } from '../types';

class AuthRepository {
  async login(email: string, password: string): Promise<User> {
    const response = await authApi.login(email, password);
    console.log('response', response);
    const { accessToken, refreshToken, user } = response.data;
    await StorageHelper.setItem(StorageKeys.ACCESS_TOKEN, accessToken);
    await StorageHelper.setItem(StorageKeys.REFRESH_TOKEN, refreshToken);
    return user;
  }

  async refreshToken(): Promise<string> {
    const token: any = await StorageHelper.getItem(StorageKeys.REFRESH_TOKEN);
    const response = await authApi.refreshToken(token);
    await StorageHelper.setItem(
      StorageKeys.ACCESS_TOKEN,
      response.data.accessToken,
    );
    return response.data.accessToken;
  }

  async logout(): Promise<void> {
    await StorageHelper.removeItem(StorageKeys.ACCESS_TOKEN);
    await StorageHelper.removeItem(StorageKeys.REFRESH_TOKEN);
  }
}

export const authRepository = new AuthRepository();
