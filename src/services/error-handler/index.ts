import { Alert } from 'react-native';
import { storageService, StorageKeys } from '../storage';
import { store } from '../../stores';
import { clearUser } from '../../stores/auth';

export type ParsedError = {
  status?: number;
  code?: string | number;
  message: string;
  original?: unknown;
};

interface ApiErrorResponse {
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
      detail?: string;
      code?: string | number;
    };
  };
  request?: unknown;
  message?: string;
}

function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'request' in error || 'message' in error)
  );
}

/**
 * Parse API errors into a consistent format
 */
export const parseApiError = (err: unknown): ParsedError => {
  if (!err) return { message: 'Unknown error', original: err };

  if (!isApiError(err)) {
    return { message: 'An error occurred', original: err };
  }

  if (err.response) {
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

/**
 * Show an error alert with optional retry functionality
 * Handles 401 errors specially by clearing session
 */
export const showApiErrorAlert = async (
  err: unknown,
  opts?: { onRetry?: () => void | Promise<unknown>; title?: string },
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
    const buttons: Array<{ text: string; onPress: () => void }> = [];
    if (opts?.onRetry) {
      buttons.push({
        text: 'Retry',
        onPress: () => {
          const result = opts.onRetry?.();
          if (result && typeof result === 'object' && 'then' in result) {
            result.then(() => resolve()).catch(() => resolve());
          } else {
            resolve();
          }
        },
      });
    }
    buttons.push({ text: 'OK', onPress: () => resolve() });
    Alert.alert(title, parsed.message, buttons, { cancelable: true });
  });
};

export default { parseApiError, showApiErrorAlert };
