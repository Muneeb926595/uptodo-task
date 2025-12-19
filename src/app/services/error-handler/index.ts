import { Alert, Platform } from 'react-native';
import { storageService, StorageKeys } from '../../../modules/services/storage';
import { store } from '../../stores';
import { clearUser } from '../../../modules/auth/store/authSlice';

export type ParsedError = {
  status?: number;
  code?: string | number;
  message: string;
  original?: any;
};

export const parseApiError = (err: any): ParsedError => {
  if (!err) return { message: 'Unknown error', original: err };
  if (err?.response) {
    const { status, data } = err?.response;
    const message =
      (data && (data?.message || data?.error || data?.detail)) ||
      err?.message ||
      'An error occurred';
    return { status, message, original: err, code: data?.code };
  }
  if (err?.request) {
    return {
      message: 'Network error. Please check your connection.',
      original: err,
    };
  }
  return { message: err?.message || 'An error occurred', original: err };
};

export const showApiErrorAlert = async (
  err: any,
  opts?: { onRetry?: () => void | Promise<any>; title?: string },
) => {
  const parsed = parseApiError(err);
  const title =
    opts?.title || (parsed.status === 401 ? 'Session expired' : 'Error');

  // handle 401 specially: clear session and prompt to login
  if (parsed?.status === 401) {
    // clear tokens and user
    await storageService.removeItem(StorageKeys.ACCESS_TOKEN);
    await storageService.removeItem(StorageKeys.REFRESH_TOKEN);
    try {
      store.dispatch(clearUser());
    } catch (e) {
      // ignore
    }
    return new Promise<void>(resolve => {
      Alert.alert(
        title,
        parsed.message || 'Your session has expired. Please log in again.',
        [{ text: 'OK', onPress: () => resolve() }],
      );
    });
  }

  return new Promise<void>(resolve => {
    const buttons: any[] = [];
    if (opts?.onRetry) {
      buttons.push({
        text: 'Retry',
        onPress: () => resolve(opts.onRetry && opts.onRetry()),
      });
    }
    buttons.push({ text: 'OK', onPress: () => resolve() });
    // On Android use Alert.alert
    Alert.alert(title, parsed.message, buttons, { cancelable: true });
  });
};

export default { parseApiError, showApiErrorAlert };
