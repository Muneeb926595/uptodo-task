export const profileKeys = {
  all: () => ['profile'] as const,
  details: () => [...profileKeys.all(), 'details'] as const,
  appLock: () => [...profileKeys.all(), 'appLock'] as const,
};
