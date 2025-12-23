export const focusKeys = {
  all: () => ['focus'] as const,
  activeSession: () => [...focusKeys.all(), 'activeSession'] as const,
  stats: (weekOffset?: number) =>
    [...focusKeys.all(), 'stats', weekOffset ?? 0] as const,
  sessions: () => [...focusKeys.all(), 'sessions'] as const,
};
