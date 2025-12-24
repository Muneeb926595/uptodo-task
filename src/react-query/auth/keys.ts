export const authKeys = {
  user: () => ['auth', 'user'] as const,
  loggedIn: () => ['auth', 'loggedIn'] as const,
};
