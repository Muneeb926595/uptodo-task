import axiosClient from '../../../app/services/axios/axiosClient';

export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post('/auth/login', { email, password }),
  refreshToken: (token: string) => axiosClient.post('/auth/refresh', { token }),
};
