export const focusKeys = {
  all: () => ['focus'] as const,
  activeSession: () => [...focusKeys.all(), 'activeSession'] as const,
  stats: () => [...focusKeys.all(), 'stats'] as const,
  sessions: () => [...focusKeys.all(), 'sessions'] as const,
};
