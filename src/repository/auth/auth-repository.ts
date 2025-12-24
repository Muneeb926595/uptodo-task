import { storageService, StorageKeys } from '../../services/storage';
import { authApi } from '../../api/endpoints/auth.api';
import { User } from '../../types';

class AuthRepository {
  async login(email: string, password: string): Promise<User> {
    const response = await authApi.login(email, password);

    const { accessToken, refreshToken, user } = response.data;
    await storageService.setItem(StorageKeys.ACCESS_TOKEN, accessToken);
    await storageService.setItem(StorageKeys.REFRESH_TOKEN, refreshToken);
    return user;
  }

  async refreshToken(): Promise<string> {
    const token: any = await storageService.getItem(StorageKeys.REFRESH_TOKEN);
    const response = await authApi.refreshToken(token);
    await storageService.setItem(
      StorageKeys.ACCESS_TOKEN,
      response.data.accessToken,
    );
    return response.data.accessToken;
  }

  async logout(): Promise<void> {
    await storageService.removeItem(StorageKeys.ACCESS_TOKEN);
    await storageService.removeItem(StorageKeys.REFRESH_TOKEN);
  }
}

export const authRepository = new AuthRepository();
