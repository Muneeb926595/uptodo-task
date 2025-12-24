import axiosClient from '../axios/axiosClient';

export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post('/auth/login', { email, password, source: 'Teacher' }),
  refreshToken: (token: string) => axiosClient.post('/auth/refresh', { token }),
};
