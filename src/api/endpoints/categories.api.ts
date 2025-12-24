import axiosClient from '../axios/axiosClient';

export const categoriesApi = {
  login: (email: string, password: string) =>
    axiosClient.post('/auth/login', { email, password }),
  refreshToken: (token: string) => axiosClient.post('/auth/refresh', { token }),
};
