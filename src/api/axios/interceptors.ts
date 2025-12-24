import axiosClient from './axiosClient';
import errorHandler from '../../services/error-handler';
import { AxiosError } from 'axios';
import { storageService, StorageKeys } from '../../services/storage';

// Request interceptor: attach access token if present
axiosClient.interceptors.request.use(
  async config => {
    try {
      const token: any = await storageService.getItem(StorageKeys.ACCESS_TOKEN);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor: centralized error handling and retry support
axiosClient.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    try {
      const parsed = errorHandler.parseApiError(error);

      // 401: clear session and show message (no retry)
      if (parsed.status === 401) {
        await errorHandler.showApiErrorAlert(error);
        return Promise.reject(error);
      }

      // For other errors, show alert with Retry option which will re-run the request if chosen
      return new Promise((_, reject) => {
        errorHandler
          .showApiErrorAlert(error, {
            onRetry: () => axiosClient.request(error.config as any),
          })
          .then(() => reject(error))
          .catch(() => reject(error));
      });
    } catch (e) {
      return Promise.reject(error);
    }
  },
);

// If needed refresh token in future

// import axios from 'axios';
// import axiosClient from './axiosClient';
// import errorHandler from '../error-handler';
// import { AxiosError } from 'axios';
// import StorageHelper, { StorageKeys } from '../../data/mmkv-storage';

// // Request interceptor: attach access token if present
// axiosClient.interceptors.request.use(
//   async config => {
//     try {
//       const token: any = await storageService.getItem(StorageKeys.ACCESS_TOKEN);
//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (e) {
//       // ignore
//     }
//     return config;
//   },
//   error => Promise.reject(error),
// );

// // Refresh token queue helpers
// let isRefreshing = false;
// let refreshQueue: Array<(token?: string, err?: any) => void> = [];

// function processQueue(error?: any, token?: string) {
//   refreshQueue.forEach(cb => cb(token, error));
//   refreshQueue = [];
// }

// async function onRefreshToken(): Promise<string> {
//   // NOTE: Use a raw axios instance without interceptors to avoid recursion.
//   const refreshToken: any = await storageService.getItem(
//     StorageKeys.REFRESH_TOKEN,
//   );
//   if (!refreshToken) throw new Error('No refresh token available');

//   const raw = axios.create({
//     baseURL: axiosClient.defaults.baseURL,
//     timeout: 30_000,
//     headers: { 'Content-Type': 'application/json' },
//   });

//   // Adjust endpoint/payload according to your backend; this matches auth.api.refreshToken
//   const resp = await raw.post('/auth/refresh', { token: refreshToken });
//   const newToken = resp?.data?.accessToken;
//   const newRefresh = resp?.data?.refreshToken;
//   if (!newToken) throw new Error('Refresh failed');

//   await storageService.setItem(StorageKeys.ACCESS_TOKEN, newToken);
//   if (newRefresh) {
//     await storageService.setItem(StorageKeys.REFRESH_TOKEN, newRefresh);
//   }
//   return newToken;
// }

// // Response interceptor: handle 401 with token refresh and surface other errors via errorHandler
// axiosClient.interceptors.response.use(
//   res => res,
//   async (error: AxiosError) => {
//     const originalRequest: any = error.config;

//     // If 401, attempt refresh + retry (queue concurrent requests)
//     if (error.response?.status === 401 && !originalRequest?._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           refreshQueue.push((token?: string, err?: any) => {
//             if (err || !token) return reject(err || error);
//             originalRequest.headers = originalRequest.headers || {};
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             resolve(axiosClient(originalRequest));
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const newToken = await onRefreshToken();
//         processQueue(null, newToken);
//         originalRequest.headers = originalRequest.headers || {};
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return axiosClient(originalRequest);
//       } catch (refreshErr) {
//         processQueue(refreshErr, undefined);
//         // If refresh fails, surface session-expired alert which also clears session
//         try {
//           await errorHandler.showApiErrorAlert(error);
//         } catch (e) {
//           // ignore
//         }
//         return Promise.reject(refreshErr);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // Non-401: show alert with Retry option that will re-run the request if chosen
//     try {
//       return await new Promise((resolve, reject) => {
//         errorHandler
//           .showApiErrorAlert(error, {
//             onRetry: () => axiosClient.request(originalRequest as any),
//           })
//           .then((res: any) => {
//             // If onRetry returned a promise and succeeded, resolve with its value
//             if (res) return resolve(res);
//             return reject(error);
//           })
//           .catch(() => reject(error));
//       });
//     } catch (e) {
//       return Promise.reject(error);
//     }
//   },
// );
