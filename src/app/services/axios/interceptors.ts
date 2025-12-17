import StorageHelper, { StorageKeys } from '../../data/mmkv-storage';
import axiosClient from './axiosClient';

let isRefreshing = false;
let refreshQueue: Array<(token?: string) => void> = [];

async function onRefreshToken() {
  // Implement refresh call (call backend refresh endpoint using a raw axios client without interceptors)
  // Example: return await refreshAuthToken(currentRefreshToken);
  // This function should return new access token or throw.
  throw new Error('Implement token refresh');
}

function processQueue(error?: any, token?: string) {
  refreshQueue.forEach(cb => cb(token));
  refreshQueue = [];
}

axiosClient.interceptors.request.use(
  async config => {
    const token = await StorageHelper.getItem(StorageKeys.ACCESS_TOKEN);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => Promise.reject(err),
);

axiosClient.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token?: string) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            } else {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // const refreshToken = await StorageHelper.getItem(
        //   StorageKeys.REFRESH_TOKEN,
        // );
        const newToken: any = await onRefreshToken(); // implement actual refresh logic
        // await StorageHelper.setItem(StorageKeys.ACCESS_TOKEN, newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, undefined);
        // dispatch logout action
        // store.dispatch(authActions.logout());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);
