import { QueryClient } from '@tanstack/react-query';

export const upsertQueryData = <T>(
  qc: QueryClient,
  key: any,
  item: T,
  getId: (t: T) => string,
) => {
  const existing = qc.getQueryData<T[]>(key) ?? [];
  const id = getId(item);
  const next = existing.map(e => (getId(e as any) === id ? item : e));
  if (!next.find(e => getId(e as any) === id)) next.unshift(item);
  qc.setQueryData(key, next);
};

export const removeQueryData = <T>(
  qc: QueryClient,
  key: any,
  id: string,
  getId: (t: T) => string,
) => {
  const existing = qc.getQueryData<T[]>(key) ?? [];
  const next = existing.filter(e => getId(e as any) !== id);
  qc.setQueryData(key, next);
};

// Cache helpers (upsert/remove)

// Purpose: Safely update cached collections without a full refetch (useful for optimistic updates).
// Behavior: E.g., upsertQueryData(qc, todosKey, todo, t => t.id) will find and replace an item or add it to the front.
// Benefit: Makes local cache updates succinct and less error-prone, especially during optimistic UI updates.
