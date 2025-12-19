// src/services/reactQuery/queryClient.tsx

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import errorHandler from '../../../modules/services/error-handler';
import { AppState } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      // cacheTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Subscribe to query and mutation cache changes to surface errors globally.
// This avoids TypeScript issues with providing onError inside defaultOptions for queries.
queryClient.getQueryCache().subscribe(({ query }) => {
  const err = (query as any)?.state?.error;
  if (err) {
    errorHandler.showApiErrorAlert(err as any).catch(() => {});
  }
});

queryClient.getMutationCache().subscribe(({ mutation }) => {
  const err = (mutation as any)?.state?.error;
  if (err) {
    errorHandler.showApiErrorAlert(err as any).catch(() => {});
  }
});

export const ReactQueryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      focusManager.setFocused(state === 'active');
    });
    return () => {
      // for RN >= 0.65, remove() is not part of subscription: see docs
      subscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
